"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseFlexible = tryParseFlexible;
exports.tryParseJsonFragments = tryParseJsonFragments;
const jsonc_parser_1 = require("jsonc-parser");
// 预编译正则，避免循环中重复创建
const RE_JSON_LIKE = /^[\{\[]/;
// 仅当整段为一对引号包裹，且内部引号都是转义形式时才视为“外层引号”
const RE_OUTER_QUOTED_SAFE = /^"(?:[^"\\]|\\.)*"$/;
const RE_BS = /\\\\/g;
const RE_QUOTE = /\\"/g;
const RE_N = /\\n/g;
const RE_R = /\\r/g;
const RE_T = /\\t/g;
const RE_INTEGER = /^-?\d+$/;
const MAX_SAFE_INTEGER_TEXT = String(Number.MAX_SAFE_INTEGER);
function success(value, finalText) {
    return {
        value,
        finalText,
        exactIntegers: collectExactIntegers(finalText)
    };
}
function collectExactIntegers(text) {
    const tokensByPath = new Map();
    const clearPath = (pathSupplier) => {
        tokensByPath.delete(JSON.stringify(pathSupplier()));
    };
    (0, jsonc_parser_1.visit)(text, {
        onObjectBegin(_offset, _length, _startLine, _startCharacter, pathSupplier) {
            clearPath(pathSupplier);
        },
        onArrayBegin(_offset, _length, _startLine, _startCharacter, pathSupplier) {
            clearPath(pathSupplier);
        },
        onLiteralValue(value, offset, length, _startLine, _startCharacter, pathSupplier) {
            const path = [...pathSupplier()];
            const pathKey = JSON.stringify(path);
            tokensByPath.delete(pathKey);
            const raw = text.slice(offset, offset + length);
            if (typeof value !== 'number' || !isUnsafeInteger(raw)) {
                return;
            }
            tokensByPath.set(pathKey, { path, raw });
        }
    }, { allowTrailingComma: true });
    return [...tokensByPath.values()];
}
function isUnsafeInteger(raw) {
    if (!RE_INTEGER.test(raw)) {
        return false;
    }
    const digits = raw.startsWith('-') ? raw.slice(1) : raw;
    return digits.length > MAX_SAFE_INTEGER_TEXT.length
        || (digits.length === MAX_SAFE_INTEGER_TEXT.length && digits > MAX_SAFE_INTEGER_TEXT);
}
function parseStructured(text) {
    try {
        return success(JSON.parse(text), text);
    }
    catch (jsonError) {
        const errors = [];
        const value = (0, jsonc_parser_1.parse)(text, errors, { allowTrailingComma: true });
        if (errors.length === 0) {
            return success(value, text);
        }
        return {
            value: null,
            error: jsonError ?? new Error('JSONC 解析失败：' + JSON.stringify(errors.slice(0, 5))),
            finalText: text
        };
    }
}
function tryParseFlexible(input, maxDepth = 6, options = {}) {
    let s = input;
    let lastErr;
    // 去除{ } 前后的内容
    if (options.extractFragment !== false) {
        const fragment = findJsonFragmentRanges(s)[0];
        if (fragment) {
            s = s.slice(fragment.start, fragment.end);
        }
        else {
            const match = s.match(/{[\s\S]*}/);
            if (match) {
                s = match[0];
            }
        }
    }
    for (let i = 0; i < maxDepth; i++) {
        s = s.trim();
        if (RE_JSON_LIKE.test(s)) {
            const result = parseStructured(s);
            if (result.value !== null) {
                return result;
            }
            lastErr = result.error;
        }
        // 合法的外层 JSON 字符串使用 JSON.parse 精确解开一层。
        if (RE_OUTER_QUOTED_SAFE.test(s)) {
            try {
                const decoded = JSON.parse(s);
                if (typeof decoded === 'string' && decoded !== s) {
                    s = decoded;
                    continue;
                }
            }
            catch (error) {
                lastErr = error;
            }
        }
        // 兼容未使用外层引号包裹的旧式转义 JSON；仅在正常解析失败后执行。
        const replaced = s.replace(RE_BS, '\\')
            .replace(RE_QUOTE, '"')
            .replace(RE_N, '\n')
            .replace(RE_R, '\r')
            .replace(RE_T, '\t');
        if (replaced === s) {
            break;
        }
        s = replaced;
    }
    const finalResult = parseStructured(s);
    if (finalResult.value !== null) {
        return finalResult;
    }
    return { value: null, error: finalResult.error ?? lastErr, finalText: s };
}
function tryParseJsonFragments(input, maxDepth = 6) {
    const ranges = findJsonFragmentRanges(input);
    const fragments = [];
    for (const range of ranges) {
        const source = input.slice(range.start, range.end);
        const result = tryParseFlexible(source, maxDepth, { extractFragment: false });
        if (result.value !== null) {
            fragments.push({
                start: range.start,
                end: range.end,
                value: result.value,
                finalText: result.finalText ?? source,
                exactIntegers: result.exactIntegers
            });
        }
    }
    return fragments.length > 0
        ? { value: fragments, finalText: input }
        : { value: null, error: new Error('未找到可解析的 JSON 片段'), finalText: input };
}
function findJsonFragmentRanges(input) {
    const ranges = [];
    const stack = [];
    let start = -1;
    let inString = false;
    let escaped = false;
    let inLineComment = false;
    let inBlockComment = false;
    const reset = () => {
        stack.length = 0;
        start = -1;
        inString = false;
        escaped = false;
        inLineComment = false;
        inBlockComment = false;
    };
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        const next = input[i + 1];
        if (stack.length === 0) {
            if (ch === '{' || ch === '[') {
                start = i;
                stack.push(ch === '{' ? '}' : ']');
            }
            continue;
        }
        if (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (ch === '\\') {
                escaped = true;
            }
            else if (ch === '"') {
                inString = false;
            }
            continue;
        }
        if (inLineComment) {
            if (ch === '\n' || ch === '\r') {
                inLineComment = false;
            }
            continue;
        }
        if (inBlockComment) {
            if (ch === '*' && next === '/') {
                inBlockComment = false;
                i++;
            }
            continue;
        }
        if (ch === '"') {
            inString = true;
            continue;
        }
        if (ch === '/' && next === '/') {
            inLineComment = true;
            i++;
            continue;
        }
        if (ch === '/' && next === '*') {
            inBlockComment = true;
            i++;
            continue;
        }
        if (ch === '{' || ch === '[') {
            stack.push(ch === '{' ? '}' : ']');
            continue;
        }
        if (ch === '}' || ch === ']') {
            if (stack[stack.length - 1] !== ch) {
                reset();
                continue;
            }
            stack.pop();
            if (stack.length === 0 && start >= 0) {
                ranges.push({ start, end: i + 1 });
                reset();
            }
        }
    }
    return ranges;
}
//# sourceMappingURL=parseJson.js.map