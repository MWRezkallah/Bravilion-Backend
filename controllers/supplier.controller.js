"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.getSupplier = exports.getAllSuppliers = exports.createSupplier = void 0;
const SupplierRepository_1 = require("../repositories/SupplierRepository");
const lib_1 = require("../lib");
const fs_1 = require("fs");
const createSupplier = async (req, res) => {
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const logoImage = lib_1.extractImageModel(values[0][0]);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            code: `${req.body.englishName} - ${Date.now()}`,
            logo: logoImage,
            headQuarter: {
                address: {
                    arabic: req.body.hqArabicAdd,
                    english: req.body.hqEnglishAdd
                },
                email: req.body.hqEmail,
                phone: req.body.hqPhone
            }
        };
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.create(data);
        res.status(200).send({
            status: "success!",
            data: supplier
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createSupplier = createSupplier;
const getAllSuppliers = async (req, res) => {
    try {
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const suppliers = await supplierRepo.findAll();
        res.status(200).send({
            status: "success",
            data: suppliers
        });
    }
    catch (err) {
        res.status(400).send({
            status: 'Error',
            Error: err
        });
    }
};
exports.getAllSuppliers = getAllSuppliers;
const getSupplier = async (req, res) => {
    try {
        const _id = req.params.id;
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.findOne(_id);
        res.status(200).send({
            status: "success",
            data: supplier
        });
    }
    catch (err) {
        res.status(400).send({
            status: "Error",
            Error: err
        });
    }
};
exports.getSupplier = getSupplier;
const updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.findOne(supplierId);
        const values = Object.values(req.files !== undefined ? req.files : {});
        const logoImage = lib_1.extractImageModel(values[0][0], supplier.logo.createdAt);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            code: supplier.code,
            logo: logoImage,
            headQuarter: {
                address: {
                    arabic: req.body.hqArabicAdd,
                    english: req.body.hqEnglishAdd
                },
                email: req.body.hqEmail,
                phone: req.body.hqPhone
            }
        };
        const updatedSupplier = await supplierRepo.update(supplierId, data);
        // if updated without error the old logo will be deleted
        const prevLogo = supplier.logo;
        fs_1.unlinkSync(prevLogo.path);
        res.status(200).send({
            status: "success!",
            data: updatedSupplier
        });
    }
    catch (err) {
        res.status(400).send({
            status: "Error",
            Error: err
        });
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository_1.SupplierRepository();
        const supplier = await supplierRepo.findOne(supplierId);
        await supplierRepo.delete(supplierId);
        fs_1.unlinkSync(supplier.logo.path);
        res.status(200).send({
            status: "success",
            message: `${supplier.name.english} deleted successfully!`
        });
    }
    catch (err) {
        res.status(400).send({
            status: "Error",
            Error: err
        });
    }
};
exports.deleteSupplier = deleteSupplier;
//# sourceMappingURL=supplier.controller.js.map