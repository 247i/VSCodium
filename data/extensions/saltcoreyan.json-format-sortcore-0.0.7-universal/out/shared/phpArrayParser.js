"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhpArray = parsePhpArray;
/**
 * 解析 PHP array 字符串为 JavaScript 对象。
 */
function parsePhpArray(input) {
    const start = findArrayStart(input);
    if (start < 0) {
        throw new Error('无效的 PHP array 格式：缺少 array(...)。');
    }
    const parsed = parseArray(input, start);
    return parsed.value;
}
function findArrayStart(input) {
    let inString = false;
    let escaped = false;
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (ch === '\\') {
                escaped = true;
            }
            else if (ch === "'") {
                inString = false;
            }
            continue;
        }
        if (ch === "'") {
            inString = true;
            continue;
        }
        if (matchesWord(input, i, 'array')) {
            let next = skipWhitespace(input, i + 5);
            if (input[next] === '(') {
                return i;
            }
        }
    }
    return -1;
}
function parseObject(input, start, end) {
    const result = {};
    let index = start;
    while (index < end) {
        index = skipWhitespace(input, index);
        if (index >= end) {
            break;
        }
        const key = parseKey(input, index);
        index = skipWhitespace(input, key.end);
        if (input.slice(index, index + 2) !== '=>') {
            throw new Error(`PHP array 解析失败：位置 ${index} 缺少 '=>'。`);
        }
        index = skipWhitespace(input, index + 2);
        const parsedValue = parseValue(input, index);
        index = skipWhitespace(input, parsedValue.end);
        Object.defineProperty(result, String(key.value), {
            value: parsedValue.value,
            enumerable: true,
            configurable: true,
            writable: true
        });
        if (index < end) {
            if (input[index] !== ',') {
                throw new Error(`PHP array 解析失败：位置 ${index} 应为逗号。`);
            }
            index++;
        }
    }
    return result;
}
function parseKey(input, start) {
    if (input[start] === "'") {
        return parseString(input, start);
    }
    const match = /^-?\d+/.exec(input.slice(start));
    if (!match) {
        throw new Error(`PHP array 解析失败：位置 ${start} 的键无效。`);
    }
    return { value: Number(match[0]), end: start + match[0].length };
}
function parseValue(input, start) {
    if (input[start] === "'") {
        return parseString(input, start);
    }
    let index = start;
    if (matchesObjectCast(input, index)) {
        index = skipWhitespace(input, index + '(object)'.length);
        if (!matchesWord(input, index, 'array')) {
            throw new Error(`PHP array 解析失败：位置 ${index} 的 (object) 后必须是 array。`);
        }
    }
    if (matchesWord(input, index, 'array')) {
        return parseArray(input, index);
    }
    if (matchesWord(input, index, 'true')) {
        return { value: true, end: index + 4 };
    }
    if (matchesWord(input, index, 'false')) {
        return { value: false, end: index + 5 };
    }
    if (matchesWord(input, index, 'null')) {
        return { value: null, end: index + 4 };
    }
    const number = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(input.slice(index));
    if (number) {
        return { value: Number(number[0]), end: index + number[0].length };
    }
    throw new Error(`PHP array 解析失败：位置 ${start} 的值无效。`);
}
function parseString(input, start) {
    let index = start + 1;
    let value = '';
    while (index < input.length) {
        const ch = input[index];
        if (ch === "'") {
            return { value, end: index + 1 };
        }
        if (ch === '\\') {
            index++;
            if (index >= input.length) {
                break;
            }
            const escaped = input[index];
            value += escaped === "'" || escaped === '\\' ? escaped : '\\' + escaped;
        }
        else {
            value += ch;
        }
        index++;
    }
    throw new Error(`PHP array 解析失败：位置 ${start} 的字符串未结束。`);
}
function parseArray(input, start) {
    if (!matchesWord(input, start, 'array')) {
        throw new Error(`PHP array 解析失败：位置 ${start} 缺少 array。`);
    }
    let index = skipWhitespace(input, start + 5);
    if (input[index] !== '(') {
        throw new Error(`PHP array 解析失败：位置 ${index} 缺少左括号。`);
    }
    const contentStart = ++index;
    let depth = 1;
    let inString = false;
    let escaped = false;
    while (index < input.length) {
        const ch = input[index];
        if (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (ch === '\\') {
                escaped = true;
            }
            else if (ch === "'") {
                inString = false;
            }
        }
        else if (ch === "'") {
            inString = true;
        }
        else if (ch === '(') {
            depth++;
        }
        else if (ch === ')') {
            depth--;
            if (depth === 0) {
                return { value: parseObject(input, contentStart, index), end: index + 1 };
            }
        }
        index++;
    }
    throw new Error(`PHP array 解析失败：位置 ${start} 的括号未闭合。`);
}
function matchesObjectCast(input, start) {
    return input.slice(start, start + 8).toLowerCase() === '(object)';
}
function matchesWord(input, start, word) {
    if (input.slice(start, start + word.length).toLowerCase() !== word) {
        return false;
    }
    const previous = input[start - 1];
    const next = input[start + word.length];
    return (!previous || !/[a-z0-9_]/i.test(previous)) && (!next || !/[a-z0-9_]/i.test(next));
}
function skipWhitespace(input, start) {
    let index = start;
    while (index < input.length && /\s/.test(input[index])) {
        index++;
    }
    return index;
}
//# sourceMappingURL=phpArrayParser.js.map