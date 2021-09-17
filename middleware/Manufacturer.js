"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeManufacturer = exports.authenticateManufacturer = exports.manuUpdate = exports.manuRegister = void 0;
const jwt = require("jsonwebtoken");
const repositories_1 = require("../repositories");
const Storage = require("@google-cloud/storage");
const bson_1 = require("bson");
const manuRegister = async (req, res, next) => {
    try {
        const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!isEmail)
            throw new Error(`${isEmail ? "" : "invalid email!"}`);
        if (req.body.password.length < 6)
            throw new Error("password should at least be 6 or more characters!");
        const manuRepo = new repositories_1.ManufacturerRepository();
        const result = await manuRepo.findOneByQuery({ email: new RegExp(req.body.email, "i") });
        if (result)
            throw new Error("This company is already registered, try to login!");
        const existedName = await manuRepo.findOneByQuery({ name: new RegExp(req.body.name, "i") });
        if (existedName)
            throw new Error(`The name: ${req.body.name} already exists!, try another one...`);
        next();
    }
    catch (error) {
        // const values = Object.values(req.files !== undefined ? req.files: {});
        // const storage = new Storage();
        // await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        // await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.manuRegister = manuRegister;
const manuUpdate = async (req, res, next) => {
    var _a;
    try {
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const manuRepo = new repositories_1.ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({ "tokens": { token: token } });
        if (!manufacturer)
            throw new Error("Invalid Token");
        res.locals.manufacturer = manufacturer;
        res.locals.token = token;
        if (req.body.email) {
            const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!isEmail)
                throw new Error(`${isEmail ? "" : "invalid email!"}`);
            const result = await manuRepo.findOneByQuery({ $and: [{ "_id": { $ne: new bson_1.ObjectId(manufacturer._id) } }, { email: new RegExp(req.body.email, "i") }] });
            if (result)
                throw new Error("This email is taken, try to another one!");
        }
        if (req.body.password) {
            if (req.body.password.length < 6)
                throw new Error("password should at least be 6 or more characters!");
        }
        if (req.body.name) {
            const result = await manuRepo.findOneByQuery({ $and: [{ "_id": { $ne: new bson_1.ObjectId(manufacturer._id) } }, { name: { $regex: new RegExp(req.body.name, "i") } }] });
            if (result)
                throw new Error("This company name is taken, try to another one!");
        }
        next();
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.manuUpdate = manuUpdate;
const authenticateManufacturer = async (req, res, next) => {
    var _a;
    try {
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const manuRepo = new repositories_1.ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({ "tokens": { token: token } });
        if (!manufacturer)
            throw new Error("Invalid Token");
        res.locals.manufacturer = manufacturer;
        res.locals.token = token;
        next();
    }
    catch (err) {
        res.status(401).send({
            error: err.message
        });
    }
};
exports.authenticateManufacturer = authenticateManufacturer;
const authorizeManufacturer = async (req, res, next) => {
    var _a;
    try {
        console.log("hey");
        const token = req.header('Authorization') !== undefined ? (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '') : "";
        if (!token) {
            throw new Error("Token is missing!");
        }
        const decoded = jwt.verify(token, `${process.env.apiSecretKey}`, { complete: true });
        const manuRepo = new repositories_1.ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({ "tokens.token": token });
        if (!manufacturer)
            throw new Error("Invalid Token");
        res.locals.manufacturer = manufacturer;
        res.locals.token = token;
        next();
    }
    catch (err) {
        res.status(401).send({
            error: err.message
        });
    }
};
exports.authorizeManufacturer = authorizeManufacturer;
//# sourceMappingURL=Manufacturer.js.map