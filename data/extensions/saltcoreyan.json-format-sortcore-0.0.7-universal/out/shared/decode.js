"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDecodableEscapes = hasDecodableEscapes;
exports.decodeUnicodeEscapes = decodeUnicodeEscapes;
exports.deepDecodeUnicode = deepDecodeUnicode;
// 处理字符串的unicode编码
const RE_DECODABLE_ESCAPE = /\\(?:u[0-9a-f]{4}|x[0-9a-f]{2}|[nrtbf])/i;
function hasDecodableEscapes(input) {
    return RE_DECODABLE_ESCAPE.test(input);
}
function decodeUnicodeEscapes(input) {
    if (!input || typeof input !== 'string') {
        return input;
    }
    // 多轮解码，处理多重转义
    let prev = '';
    let cur = input;
    for (let i = 0; i < 4 && cur !== prev; i++) {
        prev = cur;
        // 先还原常见控制字符。引号、斜杠和反斜杠可能是字符串的真实内容，不自动移除。
        cur = cur
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f');
        // 代理对：\uD83D\uDE00
        cur = cur.replace(/\\u(d[89ab][0-9a-f]{2})\\u(d[cdef][0-9a-f]{2})/gi, (_m, hi, lo) => {
            const high = parseInt(hi, 16);
            const low = parseInt(lo, 16);
            const cp = (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
            return String.fromCodePoint(cp);
        });
        // 普通 \uXXXX 与 \xHH
        cur = cur
            .replace(/\\u([0-9a-f]{4})/gi, (_m, g1) => String.fromCharCode(parseInt(g1, 16)))
            .replace(/\\x([0-9a-f]{2})/gi, (_m, g1) => String.fromCharCode(parseInt(g1, 16)));
    }
    return cur;
}
function deepDecodeUnicode(value) {
    if (typeof value === 'string') {
        return decodeUnicodeEscapes(value);
    }
    if (Array.isArray(value)) {
        return value.map(deepDecodeUnicode);
    }
    if (value && typeof value === 'object') {
        const out = {};
        for (const [key, item] of Object.entries(value)) {
            Object.defineProperty(out, key, {
                value: deepDecodeUnicode(item),
                enumerable: true,
                configurable: true,
                writable: true
            });
        }
        return out;
    }
    return value;
}
//# sourceMappingURL=decode.js.map