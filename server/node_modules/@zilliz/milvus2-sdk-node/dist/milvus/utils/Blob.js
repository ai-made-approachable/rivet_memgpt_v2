"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBinaryVectorToBytes = exports.parseFloatVectorToBytes = void 0;
const parseFloatVectorToBytes = (array) => {
    // create array buffer
    const a = new Float32Array(array);
    // need return bytes to milvus proto
    return Buffer.from(a.buffer);
};
exports.parseFloatVectorToBytes = parseFloatVectorToBytes;
const parseBinaryVectorToBytes = (array) => {
    // create array buffer
    const a = new Uint8Array(array);
    // need return bytes to milvus proto
    return Buffer.from(a.buffer);
};
exports.parseBinaryVectorToBytes = parseBinaryVectorToBytes;
//# sourceMappingURL=Blob.js.map