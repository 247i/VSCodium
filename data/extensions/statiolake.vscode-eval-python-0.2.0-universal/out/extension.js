"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
let outputChannel;
function activate(context) {
    outputChannel = vscode.window.createOutputChannel("Python Eval");
    context.subscriptions.push(outputChannel);
    context.subscriptions.push(vscode.commands.registerCommand("pythonEval.evaluateSelection", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor");
            return;
        }
        const selections = editor.selections;
        const nonEmptySelections = selections.filter((sel) => !sel.isEmpty);
        if (nonEmptySelections.length === 0) {
            vscode.window.showErrorMessage("No text selected");
            return;
        }
        try {
            // Process all selections and collect results
            const results = [];
            for (const selection of nonEmptySelections) {
                const selectedText = editor.document.getText(selection);
                const result = await executePythonCode(selectedText);
                results.push({ selection, result });
            }
            // Replace all selections with their results in a single edit
            await editor.edit((editBuilder) => {
                for (const { selection, result } of results) {
                    editBuilder.replace(selection, result);
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Python execution failed: ${error}`);
        }
    }));
}
exports.activate = activate;
function removeTrailingNewlines(s) {
    return s.replace(/(\r\n|\n|\r)+$/, "");
}
async function executePythonCode(code) {
    const config = vscode.workspace.getConfiguration("pythonEval");
    const pythonPath = config.get("pythonPath", "python");
    const defaultImports = config.get("defaultImports", []);
    let prog = removeTrailingNewlines(code);
    // Handle single line vs multi-line like vim-evalvis
    if (!prog.includes("\n")) {
        // Single line: wrap with print()
        prog = `print(${prog.trim()})`;
        outputChannel.appendLine(`Single line detected, wrapped with print(): ${prog}`);
    }
    else {
        outputChannel.appendLine(`Multi-line code detected`);
    }
    // Prepare the full Python script with imports and code
    const fullScript = [...defaultImports, "", prog].join("\n");
    // Use configured Python path directly (cross-platform compatible)
    const resolvedPythonPath = pythonPath;
    const args = ["-c", fullScript];
    outputChannel.appendLine(`execute: ${resolvedPythonPath} ${JSON.stringify(args)}`);
    try {
        const { stdout, stderr } = await execFileAsync(resolvedPythonPath, args, {
            timeout: 10000,
            env: {
                ...process.env,
                PYTHONUNBUFFERED: "1",
                PYTHONIOENCODING: "utf-8", // Force Python to use UTF-8 for I/O
            },
            encoding: "utf8", // Force UTF-8 encoding to handle Japanese characters
        });
        outputChannel.appendLine(`stdout: ${JSON.stringify(stdout)}`);
        outputChannel.appendLine(`stderr: ${JSON.stringify(stderr)}`);
        if (stderr) {
            throw new Error(stderr);
        }
        // Remove trailing newlines from result like vim-evalvis (handle CRLF)
        const result = removeTrailingNewlines(stdout) || "(no output)";
        return result;
    }
    catch (error) {
        outputChannel.appendLine(`execution error: ${error}`);
        if (error.code === "ENOENT") {
            throw new Error(`Python executable not found: ${resolvedPythonPath}. Please check the pythonEval.pythonPath setting.`);
        }
        throw error;
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map