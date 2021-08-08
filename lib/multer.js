"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFilter = exports.storage = void 0;
const path = require("path");
const multer_google_storage_1 = require("multer-google-storage");
const storage = (fileContext) => {
    return new multer_google_storage_1.default({
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/') + 1);
            // console.log("===============>" , file)
            cb(null, fileContext + '-' + file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
        }
    });
};
exports.storage = storage;
const imageFilter = (req, file, cb) => {
    const allowedFormats = /jpg|jpeg|png|gif|svg/i;
    const mimeType = allowedFormats.test(file.mimetype);
    const userExtension = allowedFormats.test(path.extname(file.originalname));
    if (mimeType && userExtension) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.imageFilter = imageFilter;
//# sourceMappingURL=multer.js.map