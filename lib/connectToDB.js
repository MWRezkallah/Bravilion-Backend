"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoClient = void 0;
const mongodb_1 = require("mongodb");
exports.mongoClient = new mongodb_1.MongoClient(`${process.env.connectionString}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500,
    poolSize: 10
});
//# sourceMappingURL=connectToDB.js.map