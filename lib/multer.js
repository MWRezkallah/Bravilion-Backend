"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFilter = exports.storage = void 0;
const path = require("path");
const multer = require("multer");
const storage = (fileDestination) => {
    return multer.diskStorage({
        destination: fileDestination //note that this path is relative from where you run the command/server not from the route directory
        ,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/') + 1);
            // console.log("===============>" , file)
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
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