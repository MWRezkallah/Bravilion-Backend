"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierUpdateValidator = exports.supplierCreationValidator = void 0;
const SupplierRepository_1 = require("../repositories/SupplierRepository");
const lib_1 = require("../lib");
const fs_1 = require("fs");
const mongodb_1 = require("mongodb");
const supplierCreationValidator = async (req, res, next) => {
    try {
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.findOneByQuery({ $or: [{ "name.arabic": req.body.arabicName }, { "name.english": req.body.englishName }] });
        if (supplier) {
            throw new Error(`Supplier: ${supplier.name.english}/${supplier.name.arabic} is already existed! , try to update!`);
        }
        const isEmail = req.body.hqEmail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.hqPhone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        if (!(isEmail && isPhone)) {
            throw new Error(`${isEmail ? "" : "invalid email!"} ${isPhone ? "" : "invalid phone!"}`);
        }
        next();
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const logoImage = lib_1.extractImageModel(values[0][0]);
        fs_1.unlinkSync(logoImage.path);
        res.status(400).send({
            status: "Error",
            Error: error.message
        });
    }
};
exports.supplierCreationValidator = supplierCreationValidator;
const supplierUpdateValidator = async (req, res, next) => {
    try {
        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.findOneByQuery({ $and: [
                { _id: { $ne: new mongodb_1.ObjectId(`${supplierId}`) } },
                { $or: [{ "name.arabic": req.body.arabicName }, { "name.english": req.body.englishName }] }
            ]
        });
        if (supplier) {
            throw new Error(`Supplier Name: ${supplier.name.english}/${supplier.name.arabic} already belongs to another supplier! , try different name!`);
        }
        const isEmail = req.body.hqEmail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.hqPhone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        if (!(isEmail && isPhone)) {
            throw new Error(`${isEmail ? "" : "invalid email!"} ${isPhone ? "" : "invalid phone!"}`);
        }
        next();
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const logoImage = lib_1.extractImageModel(values[0][0]);
        fs_1.unlinkSync(logoImage.path);
        res.status(400).send({
            status: "Error",
            Error: error.message
        });
    }
};
exports.supplierUpdateValidator = supplierUpdateValidator;
//# sourceMappingURL=supplierValidation.js.map