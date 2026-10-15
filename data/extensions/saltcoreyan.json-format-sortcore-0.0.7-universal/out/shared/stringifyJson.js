"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyJson = stringifyJson;
function stringifyJson(value, indent, eol, exactIntegers = []) {
    const exactByPath = new Map(exactIntegers.map(token => [JSON.stringify(token.path), token.raw]));
    const indentUnit = typeof indent === 'number'
        ? ' '.repeat(Math.min(10, Math.max(0, indent)))
        : indent.slice(0, 10);
    return stringifyValue(value, [], 0, indentUnit, eol, exactByPath);
}
function stringifyValue(value, path, depth, indent, eol, exactByPath) {
    const exact = exactByPath.get(JSON.stringify(path));
    if (exact !== undefined) {
        return exact;
    }
    if (value === null) {
        return 'null';
    }
    if (typeof value === 'string') {
        return JSON.stringify(value);
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : 'null';
    }
    if (typeof value === 'boolean') {
        return String(value);
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]';
        }
        const items = value.map((item, index) => indent.repeat(depth + 1) + stringifyValue(item, [...path, index], depth + 1, indent, eol, exactByPath));
        return '[' + eol + items.join(',' + eol) + eol + indent.repeat(depth) + ']';
    }
    const keys = Object.keys(value);
    if (keys.length === 0) {
        return '{}';
    }
    const properties = keys.map(key => indent.repeat(depth + 1)
        + JSON.stringify(key)
        + ': '
        + stringifyValue(value[key], [...path, key], depth + 1, indent, eol, exactByPath));
    return '{' + eol + properties.join(',' + eol) + eol + indent.repeat(depth) + '}';
}
//# sourceMappingURL=stringifyJson.js.map