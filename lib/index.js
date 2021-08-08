"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractImageModel = void 0;
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
//# sourceMappingURL=index.js.map