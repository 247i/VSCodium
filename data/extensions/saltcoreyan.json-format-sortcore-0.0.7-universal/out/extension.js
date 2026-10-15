"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.parseWithWorker = parseWithWorker;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const worker_threads_1 = require("worker_threads");
const decode_1 = require("./shared/decode");
const parseJson_1 = require("./shared/parseJson");
const phpArrayParser_1 = require("./shared/phpArrayParser");
const stringifyJson_1 = require("./shared/stringifyJson");
// 预编译正则，避免重复创建
const RE_ERR_POS = /position\s+(\d+)/i;
const RE_ERR_AT_POS = /at position\s+(\d+)/i;
const RE_LF = /\n/g;
// worker 执行解析的超时时间
const WORKER_PARSE_TIMEOUT_MS = 2000;
// 64KB 内先走主线程快速路径
const SMALL_INPUT_THRESHOLD = 64 * 1024;
function activate(context) {
    const disposable = vscode.commands.registerCommand('json-format.jsonFormat', async () => {
        // 获取打开的编辑器页面
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('没有打开的活动编辑器。');
            return;
        }
        // 这是整个页面的内容
        const doc = editor.document;
        // 避免在大型二进制/非文本文件上运行（通过检测 NUL 字符）
        const lastLineIndex = Math.min(doc.lineCount - 1, 200);
        const end = lastLineIndex >= 0 ? doc.lineAt(lastLineIndex).range.end : new vscode.Position(0, 0);
        const sample = doc.getText(new vscode.Range(new vscode.Position(0, 0), end));
        if (sample.indexOf('\u0000') !== -1) {
            vscode.window.showErrorMessage('该文件似乎不是文本文件，已取消操作。');
            return;
        }
        // 这是被选中的内容
        const selection = editor.selection;
        const hasSelection = !selection.isEmpty;
        // 如果有选中，就获取选中的内容；如果没有选中，就获取所有内容
        let text = hasSelection ? doc.getText(selection) : doc.getText();
        if (!text || text.trim().length === 0) {
            vscode.window.showInformationMessage('当前选中内容或文件为空。');
            return;
        }
        // 不再手动处理 BOM/CRLF，仅做 trim
        text = text.trim();
        // 读取配置与输入大小
        const config = vscode.workspace.getConfiguration('json-format');
        const maxInputMB = Number(config.get('maxInputSizeMB', 2));
        const maxInputBytes = (Number.isNaN(maxInputMB) || maxInputMB <= 0)
            ? 0
            : Math.floor(maxInputMB * 1024 * 1024);
        const sizeBytes = Buffer.byteLength(text, 'utf8');
        if (maxInputBytes > 0 && sizeBytes > maxInputBytes) {
            vscode.window.showErrorMessage(`输入过大：${Math.round(sizeBytes / 1024)} KB，超过限制 ${Math.round(maxInputBytes / 1024)} KB，已取消操作。`);
            return;
        }
        // 读取编辑器缩进/EOL
        const editorOpts = editor.options;
        const useSpaces = editorOpts.insertSpaces === true;
        const tabSize = Number(editorOpts.tabSize) > 0 ? Number(editorOpts.tabSize) : 4;
        const indent = useSpaces ? tabSize : '\t';
        const eolStr = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
        // 仅在主线程做一次 Unicode 还原
        const cfg = vscode.workspace.getConfiguration('json-format');
        const enableDecode = cfg.get('decodeUnicode', true);
        const shouldDecode = enableDecode && (0, decode_1.hasDecodableEscapes)(text);
        let parseResult = null;
        let formatted = null;
        const trimmedText = text;
        const regex = /({|\[)|(array)/i;
        const match = trimmedText.match(regex);
        if (!match) {
            vscode.window.showInformationMessage('不支持此数据格式。');
            return;
        }
        if (match[1]) {
            // 说明是json
            const fragmentsResult = await parseJsonFragments(text, undefined, sizeBytes);
            if (fragmentsResult.value && fragmentsResult.value.length > 1) {
                formatted = formatJsonFragments(text, fragmentsResult.value, indent, eolStr, shouldDecode);
            }
            else if (fragmentsResult.value && fragmentsResult.value.length === 1) {
                const fragment = fragmentsResult.value[0];
                formatted = shouldPreserveSingleFragmentContext(text, fragment)
                    ? formatJsonFragments(text, [fragment], indent, eolStr, shouldDecode)
                    : formatJsonValue(fragment.value, indent, eolStr, shouldDecode, fragment.exactIntegers);
            }
            else {
                parseResult = await parseJson(text, undefined, sizeBytes);
            }
        }
        else if (match[2]) {
            // 说明是array
            parseResult = await parseArray(text);
        }
        else {
            vscode.window.showInformationMessage('解析有误。');
            return;
        }
        if (!formatted && (!parseResult || parseResult.value === null)) {
            // 从错误消息中提取位置并计算行列，给出片段预览
            const errMsg = parseResult?.error?.message || '无法解析为 JSON';
            let detail = errMsg;
            const finalText = parseResult?.finalText ?? text;
            if ((errMsg || '').toLowerCase().includes('超时')) {
                detail = '解析超时（输入可能过大或存在复杂多重转义），可尝试选中更小范围再试。';
            }
            else {
                const m = (RE_ERR_POS.exec(errMsg) || RE_ERR_AT_POS.exec(errMsg));
                if (m && m[1]) {
                    const idx = Math.max(0, parseInt(m[1], 10));
                    const before = finalText.slice(0, idx);
                    const lines = before.split(/\n/);
                    const line = lines.length;
                    const col = (lines[lines.length - 1] || '').length + 1;
                    const previewStart = Math.max(0, idx - 30);
                    const previewEnd = Math.min(finalText.length, idx + 30);
                    const preview = finalText.slice(previewStart, previewEnd).replace(RE_LF, '\\n');
                    detail = `${errMsg}（行 ${line} 列 ${col}，片段: ...${preview}...）`;
                }
                else {
                    const preview = (finalText || text).slice(0, 200).replace(RE_LF, '\\n');
                    detail = `${errMsg}（预览前200字符: ${preview}${(finalText || text).length > 200 ? '...' : ''}）`;
                }
            }
            vscode.window.showErrorMessage(`JSON 解析失败：${detail}`);
            return;
        }
        if (!formatted && parseResult) {
            formatted = formatJsonValue(parseResult.value, indent, eolStr, shouldDecode, parseResult.exactIntegers);
        }
        if (formatted === null) {
            vscode.window.showErrorMessage('JSON 解析失败：无法生成格式化结果。');
            return;
        }
        // 若需要按设置补尾行换行（可选）
        const insertFinalNewline = vscode.workspace.getConfiguration('files').get('insertFinalNewline', false);
        if (insertFinalNewline && !formatted.endsWith(eolStr)) {
            formatted += eolStr;
        }
        // 避免不必要的编辑操作
        const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
        if (normalize(formatted) === normalize(text)) {
            vscode.window.showInformationMessage('已是格式化的 JSON，未做修改。');
            return;
        }
        try {
            await editor.edit(editBuilder => {
                if (hasSelection) {
                    editBuilder.replace(selection, formatted);
                }
                else {
                    const firstLine = doc.lineAt(0);
                    const lastLine = doc.lineAt(doc.lineCount - 1);
                    const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                    editBuilder.replace(fullRange, formatted);
                }
            }, { undoStopBefore: true, undoStopAfter: true });
            vscode.window.showInformationMessage('JSON 格式化完成。');
        }
        catch (e) {
            vscode.window.showErrorMessage('写入文档失败：' + (e && e.message ? e.message : String(e)));
        }
    });
    context.subscriptions.push(disposable);
}
function formatJsonValue(value, indent, eolStr, enableDecode, exactIntegers) {
    const outputObj = enableDecode ? (0, decode_1.deepDecodeUnicode)(value) : value;
    return (0, stringifyJson_1.stringifyJson)(outputObj, indent, eolStr, exactIntegers);
}
function formatJsonFragments(text, fragments, indent, eolStr, enableDecode) {
    const parts = [];
    let formattedLength = 0;
    let formattedEnd = '';
    let lastEnd = 0;
    for (const fragment of fragments) {
        const before = text.slice(lastEnd, fragment.start);
        if (lastEnd > 0 && before.length > 0 && !startsWithLineBreak(before) && !endsWithLineBreak(formattedEnd)) {
            parts.push(eolStr);
            formattedLength += eolStr.length;
            formattedEnd = eolStr;
        }
        if (before.length > 0) {
            parts.push(before);
            formattedLength += before.length;
            formattedEnd = before;
        }
        if (formattedLength > 0 && !endsWithLineBreak(formattedEnd)) {
            parts.push(eolStr);
            formattedLength += eolStr.length;
            formattedEnd = eolStr;
        }
        const jsonText = formatJsonValue(fragment.value, indent, eolStr, enableDecode, fragment.exactIntegers);
        parts.push(jsonText);
        formattedLength += jsonText.length;
        formattedEnd = jsonText;
        lastEnd = fragment.end;
    }
    const after = text.slice(lastEnd);
    if (after.length > 0 && !startsWithLineBreak(after) && !endsWithLineBreak(formattedEnd)) {
        parts.push(eolStr);
    }
    parts.push(after);
    return parts.join('');
}
function startsWithLineBreak(text) {
    return text.startsWith('\n') || text.startsWith('\r');
}
function endsWithLineBreak(text) {
    return text.endsWith('\n') || text.endsWith('\r');
}
function shouldPreserveSingleFragmentContext(text, fragment) {
    const before = text.slice(0, fragment.start);
    const after = text.slice(fragment.end);
    if (before.trim().length === 0 && after.trim().length === 0) {
        return false;
    }
    try {
        return typeof JSON.parse(text) !== 'string';
    }
    catch {
        return true;
    }
}
async function parseWithWorker(input, token, mode, options = {}) {
    const workerPath = options.workerPath ?? path.join(__dirname, 'jsonParserWorker.js');
    if (!fs.existsSync(workerPath)) {
        return { value: null, error: new Error('找不到 out/jsonParserWorker.js（请运行 npm run compile）'), finalText: input };
    }
    try {
        const worker = new worker_threads_1.Worker(workerPath);
        let finished = false;
        return await new Promise((resolve) => {
            let timer;
            let cancelSub;
            const cleanup = () => {
                if (timer) {
                    clearTimeout(timer);
                }
                cancelSub?.dispose();
                worker.removeAllListeners();
                void worker.terminate();
            };
            const finish = (result) => {
                if (finished) {
                    return;
                }
                finished = true;
                cleanup();
                resolve(result);
            };
            // 支持用户取消
            const onCancel = () => {
                finish({ value: null, error: new Error('已取消'), finalText: input });
            };
            cancelSub = token?.onCancellationRequested(onCancel);
            if (token?.isCancellationRequested) {
                onCancel();
                return;
            }
            timer = setTimeout(() => {
                finish({ value: null, error: new Error('解析超时'), finalText: input });
            }, options.timeoutMs ?? WORKER_PARSE_TIMEOUT_MS);
            worker.on('message', (msg) => {
                if (msg && msg.value !== undefined) {
                    finish({ value: msg.value, finalText: msg.finalText ?? input, exactIntegers: msg.exactIntegers });
                }
                else {
                    finish({ value: null, error: new Error(msg && msg.error ? msg.error : '解析失败'), finalText: msg && msg.finalText ? msg.finalText : input });
                }
            });
            worker.on('error', (err) => {
                finish({ value: null, error: err, finalText: input });
            });
            worker.on('exit', (code) => {
                if (!finished) {
                    finish({ value: null, error: new Error(`解析 worker 提前退出（代码 ${code}）。`), finalText: input });
                }
            });
            worker.postMessage(mode === 'fragments' ? { mode, input } : input);
        });
    }
    catch (e) {
        return { value: null, error: e, finalText: input };
    }
}
async function parseJson(text, token, sizeBytes = Buffer.byteLength(text, 'utf8')) {
    // 快速路径：小输入优先在主线程解析（最多尝试 3 层反转义）
    let parseResult = null;
    if (sizeBytes <= SMALL_INPUT_THRESHOLD) {
        const quick = (0, parseJson_1.tryParseFlexible)(text, 3);
        if (quick.value !== null) {
            parseResult = quick;
        }
    }
    // 如快速路径失败或输入较大，使用 worker
    if (!parseResult) {
        parseResult = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: '解析 JSON...', cancellable: true }, async (_progress, token) => {
            await new Promise(r => setTimeout(r, 0));
            return parseWithWorker(text, token, 'single');
        });
    }
    return parseResult;
}
async function parseJsonFragments(text, token, sizeBytes = Buffer.byteLength(text, 'utf8')) {
    if (sizeBytes <= SMALL_INPUT_THRESHOLD) {
        return (0, parseJson_1.tryParseJsonFragments)(text, 3);
    }
    return await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: '解析 JSON 片段...', cancellable: true }, async (_progress, token) => {
        await new Promise(r => setTimeout(r, 0));
        return parseWithWorker(text, token, 'fragments');
    });
}
async function parseArray(text, token) {
    try {
        const value = (0, phpArrayParser_1.parsePhpArray)(text);
        return { value, finalText: text };
    }
    catch (error) {
        return { value: null, error: error, finalText: text };
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map