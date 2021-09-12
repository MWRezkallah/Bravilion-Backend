"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPdfModel = exports.extractImageModel = void 0;
const extractImageModel = (file, createdAt = Date.now()) => {
    const path = file.path.split("\\").join("/");
    return {
        name: file.filename,
        type: file.mimetype,
        path: path,
        createdAt: createdAt,
        modifiedAt: Date.now()
    };
};
exports.extractImageModel = extractImageModel;
const extractPdfModel = (file, createdAt = Date.now()) => {
    const path = file.path.split("\\").join("/");
    return {
        name: file.filename,
        type: file.mimetype,
        path: path,
        createdAt: createdAt,
        modifiedAt: Date.now()
    };
};
exports.extractPdfModel = extractPdfModel;
//# sourceMappingURL=index.js.map