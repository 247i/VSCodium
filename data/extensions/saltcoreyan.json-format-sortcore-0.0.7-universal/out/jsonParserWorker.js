"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const parseJson_1 = require("./shared/parseJson");
//  worker 里解析json
worker_threads_1.parentPort?.on('message', (message) => {
    const input = typeof message === 'string' ? message : message.input;
    try {
        const result = typeof message === 'string'
            ? (0, parseJson_1.tryParseFlexible)(input, 6)
            : (0, parseJson_1.tryParseJsonFragments)(input, 6);
        if (result.value !== null) {
            worker_threads_1.parentPort.postMessage({
                value: result.value,
                finalText: result.finalText ?? input,
                exactIntegers: 'exactIntegers' in result ? result.exactIntegers : undefined
            });
        }
        else {
            worker_threads_1.parentPort.postMessage({
                error: result.error?.message || '解析失败',
                finalText: result.finalText ?? input
            });
        }
    }
    catch (err) {
        worker_threads_1.parentPort.postMessage({
            error: err?.message || String(err),
            finalText: typeof input === 'string' ? input.slice(0, 2000) : ''
        });
    }
});
//# sourceMappingURL=jsonParserWorker.js.map