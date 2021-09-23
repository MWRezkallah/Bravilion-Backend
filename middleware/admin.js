"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const jwt = require("jsonwebtoken");
const user_model_1 = require("../models/base/user.model");
const connect_controller_1 = require("../controllers/connect.controller");
const authorizeAdmin = async (req, res, next) => {
    var _a;
    try {
        await connect_controller_1.connect();
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const admin = await user_model_1.default.findOne({ "tokens.token": token });
        if (!admin)
            throw new Error("Invalid Token");
        res.locals.admin = admin;
        res.locals.token = token;
        next();
    }
    catch (err) {
        res.status(401).send({
            error: err.message
        });
    }
};
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=admin.js.map