"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCmakeController = createCmakeController;
const tslib_1 = require("tslib");
const vscode = require("vscode");
const path = require("path");
const os = require("os");
const cmake_runner_1 = require("./cmake-runner");
const rootItemDataMap = new WeakMap();
function createCmakeController() {
    const controller = vscode.tests.createTestController('cmakeTestExplorer', 'CMake Tests');
    controller.resolveHandler = (item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!item) {
            yield loadTestsFromAllWorkspaceFolders(controller);
        }
        else {
        }
    });
    controller.refreshHandler = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield loadTestsFromAllWorkspaceFolders(controller);
    });
    controller.createRunProfile('Run', vscode.TestRunProfileKind.Run, (request, token) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield runTests(controller, request, token);
    }));
    controller.createRunProfile('Debug', vscode.TestRunProfileKind.Debug, (request, token) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield debugTests(controller, request, token);
    }));
    return controller;
}
function loadTestsFromAllWorkspaceFolders(controller) {
    controller.items.replace([]);
    if (!vscode.workspace.workspaceFolders) {
        return [];
    }
    return Promise.all(vscode.workspace.workspaceFolders.map((workspaceFolder) => loadTestsFromWorkspace(controller, workspaceFolder)));
}
function loadTestsFromWorkspace(controller, workspaceFolder) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [autodetectBuildDirs, buildDir] = yield getConfigStrings(workspaceFolder, ['autodetectBuildDirs', 'buildDir']);
        yield loadTestsFromBuildDir(controller, workspaceFolder, vscode.Uri.file(path.resolve(workspaceFolder.uri.fsPath, buildDir)));
        if (autodetectBuildDirs === 'true') {
            const pattern = new vscode.RelativePattern(workspaceFolder, '**/' + cmake_runner_1.CTEST_TEST_FILE);
            yield loadTestsFromTestFilePattern(controller, workspaceFolder, pattern);
        }
    });
}
function loadTestsFromTestFilePattern(controller, workspaceFolder, pattern) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (const file of yield vscode.workspace.findFiles(pattern)) {
            const buildDir = path.dirname(file.fsPath);
            loadTestsFromBuildDir(controller, workspaceFolder, vscode.Uri.file(buildDir));
        }
    });
}
function loadTestsFromBuildDir(controller, workspaceFolder, buildDirUri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [buildConfig, extraCtestLoadArgs, suiteDelimiter, testFileVar, testLineVar,] = yield getConfigStrings(workspaceFolder, [
            'buildConfig',
            'extraCtestLoadArgs',
            'suiteDelimiter',
            'testFileVar',
            'testLineVar',
        ]);
        const buildDir = buildDirUri.fsPath;
        let ctestPath;
        try {
            ctestPath = (0, cmake_runner_1.getCtestPath)(buildDir);
        }
        catch (e) {
            if (e instanceof cmake_runner_1.CacheNotFoundError) {
                return;
            }
            throw e;
        }
        const cmakeTests = yield (0, cmake_runner_1.loadCmakeTests)(ctestPath, buildDir, buildConfig, extraCtestLoadArgs);
        const rootId = buildDirUri.toString();
        const label = vscode.workspace.asRelativePath(buildDir, true);
        const rootItem = controller.createTestItem(rootId, label, buildDirUri);
        rootItemDataMap.set(rootItem, { workspaceFolder });
        controller.items.add(rootItem);
        cmakeTests.forEach((test) => {
            const testId = test.name;
            let testUri;
            let testRange;
            if (testFileVar) {
                const testFileInfo = getTestFileInfo(test, testFileVar, testLineVar);
                if (testFileInfo.file) {
                    testUri = vscode.Uri.file(path.resolve(workspaceFolder.uri.fsPath, testFileInfo.file));
                    if (!isNaN(testFileInfo.line)) {
                        const zeroBasedLine = testFileInfo.line - 1;
                        testRange = new vscode.Range(zeroBasedLine, 0, zeroBasedLine, 0);
                    }
                }
            }
            let parentItem = rootItem;
            let testName = test.name;
            if (suiteDelimiter) {
                const testPath = test.name.split(suiteDelimiter);
                testName = testPath[testPath.length - 1];
                for (let level = 0; level < testPath.length - 1; level++) {
                    const levelName = testPath[level];
                    const levelId = levelName;
                    let levelItem = parentItem.children.get(levelId);
                    if (!levelItem) {
                        levelItem = controller.createTestItem(levelId, levelName);
                        parentItem.children.add(levelItem);
                    }
                    parentItem = levelItem;
                }
            }
            const testItem = controller.createTestItem(testId, testName, testUri);
            testItem.range = testRange;
            parentItem.children.add(testItem);
        });
    });
}
function runTests(controller, request, token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const run = controller.createTestRun(request);
        try {
            if (!request.include) {
                for (const [_, rootItem] of controller.items) {
                    yield runTestsForRoot(run, rootItem, token);
                }
            }
            else {
                const itemsByRoot = collectTestItemsByRoot(request.include);
                for (const [root, tests] of itemsByRoot) {
                    yield runTestsForRoot(run, root, token, tests);
                }
            }
        }
        finally {
            run.end();
        }
    });
}
class TestRunOutput {
    constructor(run) {
        this.run = run;
        this.outputBuffers = new Map();
    }
    appendLine(testItem, line) {
        let buffer = this.outputBuffers.get(testItem);
        if (!buffer) {
            buffer = { lines: [] };
            this.outputBuffers.set(testItem, buffer);
        }
        buffer.lines.push(line);
        if (!buffer.timer) {
            buffer.timer = setTimeout(this.flushItem.bind(this), 100, testItem);
        }
    }
    flushItem(testItem) {
        let buffer = this.outputBuffers.get(testItem);
        if (!buffer)
            return;
        if (buffer.lines.length > 0) {
            this.run.appendOutput(buffer.lines.join('\r\n'), undefined, testItem);
            buffer.lines.length = 0;
        }
        if (buffer.timer) {
            clearTimeout(buffer.timer);
            buffer.timer = undefined;
        }
    }
    flushAll() {
        for (const testItem of this.outputBuffers.keys()) {
            this.flushItem(testItem);
        }
    }
}
function runTestsForRoot(run, root, token, testsToRun) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!root.uri)
            return;
        const output = new TestRunOutput(run);
        try {
            const rootItemData = rootItemDataMap.get(root);
            if (!rootItemData)
                return;
            const { workspaceFolder } = rootItemData;
            const cwd = root.uri.fsPath;
            const ctestPath = (0, cmake_runner_1.getCtestPath)(cwd);
            const options = yield getRunOptions(ctestPath, workspaceFolder, cwd);
            const [errorPattern] = yield getConfigStrings(workspaceFolder, [
                'errorPattern',
            ]);
            const errorPatternRe = new RegExp(errorPattern);
            const allTests = yield (0, cmake_runner_1.loadCmakeTests)(ctestPath, cwd, options.buildConfig, '');
            const indexToItem = new Map();
            const testIndexes = (testsToRun || collectTestItems(root)).map((test) => {
                const index = allTests.findIndex((t) => t.name === test.id) + 1;
                if (index > 0) {
                    indexToItem.set(index, test);
                }
                return index;
            });
            const testProcess = (0, cmake_runner_1.scheduleCmakeTestProcess)(testIndexes, options);
            token.onCancellationRequested(() => {
                (0, cmake_runner_1.cancelCmakeTestProcess)(testProcess);
                output.flushAll();
            });
            const decorations = new Map();
            yield (0, cmake_runner_1.executeCmakeTestProcess)(testProcess, (event) => {
                var _a, _b;
                const testItem = indexToItem.get(event.index);
                if (!testItem)
                    return;
                switch (event.type) {
                    case 'start': {
                        run.started(testItem);
                        break;
                    }
                    case 'output': {
                        output.appendLine(testItem, event.line);
                        if (event.text) {
                            const matches = (_a = event.text.match(errorPatternRe)) === null || _a === void 0 ? void 0 : _a.groups;
                            if (matches) {
                                const { file, line, severity, message } = matches;
                                if (!decorations.has(event.index)) {
                                    decorations.set(event.index, []);
                                }
                                const decoration = new vscode.TestMessage(severity ? `${severity}: ${message}` : message);
                                decoration.location = new vscode.Location(vscode.Uri.file(file), new vscode.Position(Number.parseInt(line) - 1, 0));
                                (_b = decorations.get(event.index)) === null || _b === void 0 ? void 0 : _b.push(decoration);
                            }
                        }
                        break;
                    }
                    case 'end': {
                        output.flushItem(testItem);
                        const testDecorations = decorations.get(event.index) || [];
                        switch (event.state) {
                            case 'passed':
                                run.passed(testItem, event.duration);
                                break;
                            case 'failed':
                                if (testDecorations.length > 0) {
                                    run.failed(testItem, testDecorations, event.duration);
                                }
                                else {
                                    run.failed(testItem, new vscode.TestMessage('Test failed'));
                                }
                                break;
                            case 'skipped':
                                run.skipped(testItem);
                                break;
                        }
                        break;
                    }
                }
            });
        }
        catch (e) {
            const errorMessage = new vscode.TestMessage(`${e}`);
            if (testsToRun) {
                for (const test of testsToRun) {
                    run.errored(test, [errorMessage]);
                }
            }
            else {
                const allTests = collectTestItems(root);
                for (const test of allTests) {
                    run.errored(test, [errorMessage]);
                }
            }
        }
        finally {
            output.flushAll();
        }
    });
}
function collectTestItemsByRoot(include) {
    const itemsByRoot = new Map();
    for (const item of include) {
        let root = item;
        while (root.parent) {
            root = root.parent;
        }
        const leafTests = collectTestItems(item);
        let tests = itemsByRoot.get(root) || [];
        tests.push(...leafTests);
        itemsByRoot.set(root, tests);
    }
    return itemsByRoot;
}
function collectTestItems(item) {
    if (item.children.size == 0) {
        return [item];
    }
    const results = [];
    item.children.forEach((child) => {
        if (child.children.size === 0) {
            results.push(child);
        }
        else {
            results.push(...collectTestItems(child));
        }
    });
    return results;
}
function getRunOptions(ctestPath, workspaceFolder, cwd) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [buildConfig, extraCtestRunArgs] = yield getConfigStrings(workspaceFolder, ['buildConfig', 'extraCtestRunArgs']);
        const extraCtestEnvVars = yield getConfigObject(workspaceFolder, 'extraCtestEnvVars');
        const parallelJobs = getParallelJobs(workspaceFolder);
        return {
            ctestPath,
            cwd,
            env: mergeVariablesIntoProcessEnv(extraCtestEnvVars),
            parallelJobs,
            buildConfig,
            extraArgs: extraCtestRunArgs,
        };
    });
}
function debugTests(controller, request, token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!((_a = request.include) === null || _a === void 0 ? void 0 : _a.length))
            return;
        try {
            const itemsByRoot = collectTestItemsByRoot(request.include);
            for (const [root, tests] of itemsByRoot) {
                yield debugTestsForRoot(root, token, tests);
            }
        }
        catch (e) {
            yield vscode.window.showErrorMessage(`Error debugging CMake tests: ${e}`);
        }
    });
}
function debugTestsForRoot(root, token, testsToRun) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const rootItemData = rootItemDataMap.get(root);
        if (!rootItemData)
            return;
        const { workspaceFolder } = rootItemData;
        const cwd = root.uri.fsPath;
        const ctestPath = (0, cmake_runner_1.getCtestPath)(cwd);
        const [buildConfig] = yield getConfigStrings(workspaceFolder, [
            'buildConfig',
        ]);
        const cmakeTests = yield (0, cmake_runner_1.loadCmakeTests)(ctestPath, cwd, buildConfig, '');
        for (const item of testsToRun) {
            if (token.isCancellationRequested)
                return;
            yield debugTest(workspaceFolder, cmakeTests, ctestPath, item.id);
        }
    });
}
function debugTest(workspaceFolder, cmakeTests, ctestPath, id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const test = cmakeTests.find((test) => test.name === id);
        if (!test) {
            return;
        }
        const disposables = [];
        try {
            const extraCtestEnvVars = yield getConfigObject(workspaceFolder, 'extraCtestEnvVars');
            const [debugConfig] = yield getConfigStrings(workspaceFolder, [
                'debugConfig',
            ]);
            const defaultConfig = getDefaultDebugConfiguration();
            const _a = (0, cmake_runner_1.getCmakeTestDebugConfiguration)(test), { env } = _a, debuggedTestConfig = tslib_1.__rest(_a, ["env"]);
            const mergeEnvironments = (environment) => mergeVariablesIntoDebugEnv(mergeVariablesIntoDebugEnv(environment, extraCtestEnvVars), env);
            const mergeConfigs = (_a) => {
                var { environment = [] } = _a, config = tslib_1.__rest(_a, ["environment"]);
                return (Object.assign(Object.assign(Object.assign({}, config), debuggedTestConfig), { environment: mergeEnvironments(environment) }));
            };
            const mergeLldbConfigs = (config) => (Object.assign(Object.assign(Object.assign({}, config), debuggedTestConfig), { env: Object.assign(Object.assign(Object.assign({}, config.env), extraCtestEnvVars), env) }));
            disposables.push(vscode.debug.registerDebugConfigurationProvider('*', {
                resolveDebugConfigurationWithSubstitutedVariables: (folder, config, token) => config.type === 'lldb'
                    ? mergeLldbConfigs(config)
                    : mergeConfigs(config),
            }));
            yield vscode.debug.startDebugging(workspaceFolder, debugConfig || defaultConfig);
        }
        catch (e) {
            yield vscode.window.showErrorMessage(`Error debugging CMake test ${id}: ${e}`);
        }
        finally {
            disposables.forEach((disposable) => disposable.dispose());
        }
    });
}
function getDefaultDebugConfiguration() {
    return {
        name: 'CTest',
        type: 'cppdbg',
        request: 'launch',
        windows: {
            type: 'cppvsdbg',
        },
        linux: {
            type: 'cppdbg',
            MIMode: 'gdb',
        },
        osx: {
            type: 'cppdbg',
            MIMode: 'lldb',
        },
    };
}
function getWorkspaceConfiguration(workspaceFolder) {
    return vscode.workspace.getConfiguration('cmakeExplorer', workspaceFolder.uri);
}
function getConfigStrings(workspaceFolder, names) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = getWorkspaceConfiguration(workspaceFolder);
        const varMap = yield getVariableSubstitutionMap(workspaceFolder);
        return names.map((name) => configGetStr(config, varMap, name));
    });
}
function configGetStr(config, varMap, key) {
    const configStr = config.get(key) || '';
    return substituteString(configStr, varMap);
}
function getConfigObject(workspaceFolder, name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = getWorkspaceConfiguration(workspaceFolder);
        const varMap = yield getVariableSubstitutionMap(workspaceFolder);
        const obj = config.get(name) || {};
        for (let key in obj) {
            obj[key] = substituteString(obj[key], varMap);
        }
        return obj;
    });
}
function getVariableSubstitutionMap(workspaceFolder) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const substitutionMap = new Map([
            ['${workspaceFolder}', workspaceFolder.uri.fsPath],
            ['${buildType}', 'Debug'],
            ['${buildDirectory}', ''],
        ]);
        const config = getWorkspaceConfiguration(workspaceFolder);
        const cmakeIntegration = config.get('cmakeIntegration');
        if (cmakeIntegration === 'true' || cmakeIntegration === true) {
            const cmakeExtension = vscode.extensions.getExtension('ms-vscode.cmake-tools');
            if (cmakeExtension) {
                if (!cmakeExtension.isActive)
                    yield cmakeExtension.activate();
                for (const varname of ['buildType', 'buildDirectory']) {
                    const command = `cmake.${varname}`;
                    if ((yield vscode.commands.getCommands()).includes(command)) {
                        const value = (yield vscode.commands.executeCommand(command, workspaceFolder));
                        substitutionMap.set(`\${${varname}}`, value);
                    }
                    else {
                        substitutionMap.set(`\${${varname}}`, '');
                    }
                }
            }
        }
        for (const [varname, value] of Object.entries(process.env)) {
            if (value !== undefined) {
                substitutionMap.set(`\${env:${process.platform == 'win32'
                    ? varname.toUpperCase()
                    : varname}}`, value);
            }
        }
        return substitutionMap;
    });
}
function getParallelJobs(workspaceFolder) {
    const config = getWorkspaceConfiguration(workspaceFolder);
    let parallelJobs = config.get('parallelJobs');
    if (!parallelJobs) {
        const cmakeConfig = vscode.workspace.getConfiguration('cmake', workspaceFolder.uri);
        parallelJobs =
            cmakeConfig.get('ctest.parallelJobs') ||
                cmakeConfig.get('parallelJobs') ||
                os.cpus().length;
    }
    if (parallelJobs < 1)
        parallelJobs = 1;
    return parallelJobs;
}
function getTestFileInfo(test, testFileVar, testLineVar) {
    const env = (0, cmake_runner_1.getCmakeTestEnvironmentVariables)(test);
    if (!env)
        return {};
    return {
        file: getFileFromEnvironment(env, testFileVar),
        line: getLineFromEnvironment(env, testLineVar),
    };
}
function getFileFromEnvironment(env, varname) {
    return env[varname];
}
function getLineFromEnvironment(env, varname) {
    return Number(env[varname]);
}
function substituteString(str, varMap) {
    varMap.forEach((value, key) => {
        while (str.indexOf(key) > -1) {
            str = str.replace(key, value);
        }
    });
    return str;
}
function getVariableKey(varname, env) {
    return process.platform === 'win32'
        ? Object.keys(env).find((key) => key.toUpperCase() == varname.toUpperCase()) || varname
        : varname;
}
function getVariableIndex(varname, environment) {
    return process.platform === 'win32'
        ? environment.findIndex(({ name }) => name.toUpperCase() == varname.toUpperCase())
        : environment.findIndex(({ name }) => name == varname);
}
function mergeVariablesIntoProcessEnv(variables) {
    const result = Object.assign({}, process.env);
    for (let name in variables) {
        delete result[getVariableKey(name, process.env)];
        result[name] = variables[name];
    }
    return result;
}
function mergeVariablesIntoDebugEnv(environment, variables) {
    const result = [...environment];
    for (let name in variables) {
        const variableIndex = getVariableIndex(name, environment);
        if (variableIndex == -1) {
            result.push({ name, value: variables[name] });
        }
        else {
            result[variableIndex] = { name, value: variables[name] };
        }
    }
    return result;
}
//# sourceMappingURL=cmake-controller.js.map