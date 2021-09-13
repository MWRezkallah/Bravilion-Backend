"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesOptions = exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
const lib_1 = require("../lib");
const Storage = require("@google-cloud/storage");
const bson_1 = require("bson");
const createCategory = async (req, res) => {
    var _a;
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImageData = lib_1.extractImageModel(values[0][0]);
        const iconImage = lib_1.extractImageModel(values[1][0]);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            icon: iconImage,
            level: req.body.level || 0
        };
        const re = await CategoryRepo.create(data);
        if (req.body.parentCategories) {
            const parentCategories = req.body.parentCategories.map(category => new bson_1.ObjectId(category));
            const filter = { "_id": new bson_1.ObjectId(re) };
            const updateDocs = { $addToSet: { "parentCategoryId": { $each: parentCategories } } };
            const cat = await ((_a = CategoryRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany(filter, updateDocs));
        }
        res.status(200).send({
            status: 'success',
            data: re,
        });
    }
    catch (e) {
        res.status(400).send({
            err: e
        });
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (req, res) => {
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const categories = await CategoryRepo.getCategories();
        res.status(200).send({
            status: 'success',
            data: categories,
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getAllCategories = getAllCategories;
const getCategory = async (req, res) => {
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.getCategory(_id);
        res.status(200).send({
            status: 'success',
            data: category,
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getCategory = getCategory;
const updateCategory = async (req, res) => {
    var _a;
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.findOne(_id);
        const prevCoverImage = category.cover;
        const prevIconImage = category.icon;
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevIconImage.name).delete();
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImageData = lib_1.extractImageModel(values[0][0], prevCoverImage.createdAt);
        const iconImage = lib_1.extractImageModel(values[1][0], prevIconImage.createdAt);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            icon: iconImage,
            level: req.body.level || category.level || 0
        };
        let re = await CategoryRepo.update(_id, data);
        if (req.body.parentCategories !== undefined) {
            const parentCategories = req.body.parentCategories.map(category => new bson_1.ObjectId(category));
            const filter = { "_id": new bson_1.ObjectId(_id) };
            const updateDocs = { $set: { "parentCategoryId": parentCategories } };
            const cat = await ((_a = CategoryRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany(filter, updateDocs));
        }
        res.status(200).send({
            status: 'success',
            data: re
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    var _a;
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.findOne(_id);
        const prevCoverImage = category.cover.name;
        const prevIconImage = category.icon.name;
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevIconImage).delete();
        await CategoryRepo.delete(_id);
        await ((_a = CategoryRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany({ "parentCategoryId": new bson_1.ObjectId(_id) }, { $pull: { "parentCategoryId": new bson_1.ObjectId(_id) } }));
        res.status(200).send({
            status: 'successfully delete',
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCategoriesOptions = async (req, res) => {
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const categories = await CategoryRepo.getCategoriesOptions();
        res.status(200).send({
            status: 'success',
            data: categories,
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getAllCategoriesOptions = getAllCategoriesOptions;
//# sourceMappingURL=category.controller.js.map