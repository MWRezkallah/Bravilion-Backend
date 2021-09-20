"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeClient = exports.authenticateClient = exports.clientUpdate = exports.clientRegister = void 0;
const jwt = require("jsonwebtoken");
const repositories_1 = require("../repositories");
const Storage = require("@google-cloud/storage");
const bson_1 = require("bson");
const clientRegister = async (req, res, next) => {
    try {
        const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        if (!(isEmail && isPhone)) {
            throw new Error(`${isEmail ? "" : "invalid email!"} ${isPhone ? "" : "invalid phone!"}`);
        }
        if (req.body.password.length < 6)
            throw new Error("password should at least be 6 or more characters!");
        const clientRepo = new repositories_1.ClientRepository();
        const result = await clientRepo.findOneByQuery({ $or: [{ email: new RegExp(req.body.email, "i") }, { phone: req.body.phone }] });
        if (result)
            throw new Error("This company is already registered, try to login!");
        const existedName = await clientRepo.findOneByQuery({ name: { english: new RegExp(req.body.englishName, "i"), arabic: req.body.arabicName } });
        if (existedName)
            throw new Error(`The name: ${req.body.englishName} / ${req.body.arabicName} already exists!, try another one...`);
        next();
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.clientRegister = clientRegister;
const clientUpdate = async (req, res, next) => {
    var _a;
    try {
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const clientRepo = new repositories_1.ClientRepository();
        const client = await clientRepo.findOneByQuery({ "tokens": { token: token } });
        if (!client)
            throw new Error("Invalid Token");
        res.locals.client = client;
        res.locals.token = token;
        if (req.body.email) {
            const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            const isPhone = req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
            if (!(isEmail && isPhone)) {
                throw new Error(`${isEmail ? "" : "invalid email!"} ${isPhone ? "" : "invalid phone!"}`);
            }
            const result = await clientRepo.findOneByQuery({ $and: [{ "_id": { $ne: new bson_1.ObjectId(client._id) } }, { email: new RegExp(req.body.email, "i") }] });
            if (result)
                throw new Error("This email is taken, try to another one!");
        }
        if (req.body.password) {
            if (req.body.password.length < 6)
                throw new Error("password should at least be 6 or more characters!");
        }
        if (req.body.englishName && req.body.arabicName) {
            const result = await clientRepo.findOneByQuery({ $and: [{ "_id": { $ne: new bson_1.ObjectId(client._id) } }, { name: { english: { $regex: new RegExp(req.body.englishName, "i") }, arabic: req.body.arabicName } }] });
            if (result)
                throw new Error("This  name is taken, try to another one!");
        }
        next();
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const storage = new Storage();
        if (values[0][0])
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        if (values[1][0])
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.clientUpdate = clientUpdate;
const authenticateClient = async (req, res, next) => {
    var _a;
    try {
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const clientRepo = new repositories_1.ClientRepository();
        const client = await clientRepo.findOneByQuery({ "tokens": { token: token } });
        if (!client)
            throw new Error("Invalid Token");
        res.locals.client = client;
        res.locals.token = token;
        next();
    }
    catch (err) {
        res.status(401).send({
            error: err.message
        });
    }
};
exports.authenticateClient = authenticateClient;
const authorizeClient = async (req, res, next) => {
    var _a;
    try {
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const clientRepo = new repositories_1.ClientRepository();
        const client = await clientRepo.findOneByQuery({ "tokens.token": token });
        if (!client)
            throw new Error("Invalid Token");
        res.locals.client = client;
        res.locals.token = token;
        next();
    }
    catch (err) {
        res.status(401).send({
            error: err.message
        });
    }
};
exports.authorizeClient = authorizeClient;
//# sourceMappingURL=client.js.map