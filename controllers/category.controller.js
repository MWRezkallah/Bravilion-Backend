"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesOptions = exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
const lib_1 = require("../lib");
const Storage = require("@google-cloud/storage");
const bson_1 = require("bson");
const createCategory = async (req, res) => {
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImageData = lib_1.extractImageModel(values[0][0]);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            coverImage: coverImageData,
            level: Number.parseInt(req.body.level) || 0,
        };
        if (req.body.parentCategoryId) {
            data["parentCategoryId"] = new bson_1.ObjectId(req.body.parentCategoryId);
        }
        const re = await CategoryRepo.create(data);
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
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.findOne(_id);
        const prevCoverImage = category.coverImage;
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImageData = lib_1.extractImageModel(values[0][0], prevCoverImage.createdAt);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            coverImage: coverImageData,
            level: Number.parseInt(req.body.level) || Number.parseInt(category.level) || 0,
        };
        if (req.body.parentCategoryId) {
            data["parentCategoryId"] = new bson_1.ObjectId(req.body.parentCategoryId);
        }
        let re = await CategoryRepo.update(_id, data);
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();
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
        const prevCoverImage = category.coverImage.name;
        await CategoryRepo.delete(_id);
        await ((_a = CategoryRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany({ "parentCategoryId": new bson_1.ObjectId(_id) }, { $unset: { "parentCategoryId": "" } }));
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();
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