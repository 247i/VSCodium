"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheNotFoundError = exports.CMAKE_CACHE_FILE = exports.CTEST_TEST_FILE = void 0;
exports.loadCmakeTests = loadCmakeTests;
exports.scheduleCmakeTestProcess = scheduleCmakeTestProcess;
exports.executeCmakeTestProcess = executeCmakeTestProcess;
exports.cancelCmakeTestProcess = cancelCmakeTestProcess;
exports.getCmakeTestDebugConfiguration = getCmakeTestDebugConfiguration;
exports.getCtestPath = getCtestPath;
exports.extractCtestPath = extractCtestPath;
exports.getCmakeTestEnvironmentVariables = getCmakeTestEnvironmentVariables;
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const split2 = require("split2");
const { split } = require('split-cmd');
exports.CTEST_TEST_FILE = 'CTestTestfile.cmake';
exports.CMAKE_CACHE_FILE = 'CMakeCache.txt';
const CTEST_RE = /^CMAKE_CTEST_COMMAND:INTERNAL=(.*)$/m;
const CTEST_START_RE = /^\s+Start\s+(\d+): (.+)/;
const CTEST_OUTPUT_RE = /^(\d+): (.*)$/;
const CTEST_PASSED_RE = /^\s*\d+\/\d+ Test\s+#(\d+): (.+) \.\.\.+   Passed/;
const CTEST_SKIPPED_RE = /^\s*\d+\/\d+ Test\s+#(\d+): (.+) \.\.\.+\*\*\*Skipped/;
const CTEST_DISABLED_RE = /^\s*\d+\/\d+ Test\s+#(\d+): (.+) \.\.\.+\*\*\*Not Run \(Disabled\)/;
const CTEST_FAILED_RE = /^\s*\d+\/\d+ Test\s+#(\d+): (.+) \.\.\.+/;
const CTEST_DURATION_RE = /\s+(\d+(?:\.\d+)) sec$/;
class CacheNotFoundError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, CacheNotFoundError.prototype);
    }
}
exports.CacheNotFoundError = CacheNotFoundError;
function loadCmakeTests(ctestPath, cwd, buildConfig, extraArgs = '') {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.statSync(cwd).isDirectory()) {
                throw new Error(`Directory '${cwd}' does not exist`);
            }
            const args = split(extraArgs);
            const ctestProcess = child_process.spawn(ctestPath, [
                '--show-only=json-v1',
                ...(!!buildConfig ? ['--build-config', buildConfig] : []),
                ...args,
            ], { cwd });
            if (!ctestProcess.pid) {
                throw new Error(`Cannot spawn command '${ctestPath}'`);
            }
            const out = [];
            ctestProcess.stdout
                .on('data', (data) => out.push(data))
                .on('end', () => {
                try {
                    const data = JSON.parse(out.join(''));
                    const tests = data.tests;
                    resolve(tests);
                }
                catch (e) {
                    reject(new Error(`Error parsing test list - Make sure to use a version of CTest >= 3.14 that supports option '--show-only=json-v1'`));
                }
            })
                .on('error', (error) => reject(error));
        }
        catch (e) {
            reject(e);
        }
    });
}
function scheduleCmakeTestProcess(testIndexes, { ctestPath, cwd, env, parallelJobs, buildConfig, extraArgs, }) {
    const testList = testIndexes.length
        ? ['-I', `0,0,0,${testIndexes.join(',')}`]
        : [];
    const jobs = parallelJobs > 1 ? ['-j', parallelJobs] : [];
    const args = split(extraArgs);
    const testProcess = child_process.spawn(ctestPath, [
        ...(!!buildConfig ? ['--build-config', buildConfig] : []),
        '-V',
        ...jobs,
        ...testList,
        ...args,
    ], { cwd, env });
    if (!testProcess.pid) {
        throw new Error(`Cannot run tests`);
    }
    return testProcess;
}
function executeCmakeTestProcess(testProcess, onEvent) {
    return new Promise((resolve, reject) => {
        try {
            testProcess.stdout
                .pipe(split2())
                .on('data', (line) => {
                const durationMatches = line.match(CTEST_DURATION_RE);
                const duration = durationMatches
                    ? Number.parseFloat(durationMatches[1]) * 1000
                    : undefined;
                let matches;
                if ((matches = line.match(CTEST_START_RE))) {
                    const index = Number.parseInt(matches[1]);
                    const name = matches[2];
                    onEvent({ type: 'start', index, name });
                    onEvent({ type: 'output', index, line });
                }
                else if ((matches = line.match(CTEST_OUTPUT_RE))) {
                    const index = Number.parseInt(matches[1]);
                    const text = matches[2];
                    onEvent({ type: 'output', index, line, text });
                }
                else if ((matches = line.match(CTEST_PASSED_RE))) {
                    const index = Number.parseInt(matches[1]);
                    const name = matches[2];
                    onEvent({ type: 'output', index, line });
                    onEvent({
                        type: 'end',
                        index,
                        name,
                        state: 'passed',
                        duration,
                    });
                }
                else if ((matches = line.match(CTEST_SKIPPED_RE)) ||
                    (matches = line.match(CTEST_DISABLED_RE))) {
                    const index = Number.parseInt(matches[1]);
                    const name = matches[2];
                    onEvent({ type: 'output', index, line });
                    onEvent({ type: 'end', index, name, state: 'skipped' });
                }
                else if ((matches = line.match(CTEST_FAILED_RE))) {
                    const index = Number.parseInt(matches[1]);
                    const name = matches[2];
                    onEvent({ type: 'output', index, line });
                    onEvent({
                        type: 'end',
                        index,
                        name,
                        duration,
                        state: 'failed',
                    });
                }
            })
                .on('end', () => {
                resolve({ code: testProcess.exitCode });
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
function cancelCmakeTestProcess(testProcess) {
    testProcess.kill();
}
function getCmakeTestDebugConfiguration(test) {
    const [command, ...args] = test.command;
    const WORKING_DIRECTORY = test.properties.find((p) => p.name === 'WORKING_DIRECTORY');
    const cwd = WORKING_DIRECTORY ? WORKING_DIRECTORY.value : undefined;
    const env = getCmakeTestEnvironmentVariables(test);
    return {
        name: `CTest ${test.name}`,
        program: command,
        args,
        cwd,
        env,
    };
}
function getCtestPath(cwd) {
    const cacheFilePath = path.join(cwd, exports.CMAKE_CACHE_FILE);
    if (!fs.existsSync(cacheFilePath)) {
        throw new CacheNotFoundError(`CMake cache file ${cacheFilePath} does not exist`);
    }
    return extractCtestPath(cacheFilePath);
}
function extractCtestPath(cacheFilePath) {
    const match = fs.readFileSync(cacheFilePath).toString().match(CTEST_RE);
    if (!match) {
        throw new Error(`CTest path not found in CMake cache file ${cacheFilePath}`);
    }
    return match[1];
}
function getCmakeTestEnvironmentVariables(test) {
    const ENVIRONMENT = test.properties.find((p) => p.name === 'ENVIRONMENT');
    if (!ENVIRONMENT)
        return;
    const value = ENVIRONMENT.value;
    return value.reduce((acc, v) => {
        const m = v.match(/^(.*)=(.*)$/);
        if (m) {
            acc[m[1]] = m[2];
        }
        return acc;
    }, {});
}
//# sourceMappingURL=cmake-runner.js.map