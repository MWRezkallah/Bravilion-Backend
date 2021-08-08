"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose = require("mongoose");
const url = `${process.env.connectionString}`;
const connect = async () => {
    await mongoose.connect(url, {
        dbName: process.env.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('DB Successfully Connected');
};
exports.connect = connect;
//# sourceMappingURL=connect.controller.js.map