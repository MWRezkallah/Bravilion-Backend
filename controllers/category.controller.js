"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
const lib_1 = require("../lib");
const Storage = require("@google-cloud/storage");
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
            cover: coverImageData
        };
        const re = await CategoryRepo.create(data);
        res.status(200).send({
            status: 'success',
            data: re
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
        const categories = await CategoryRepo.findAll();
        res.status(200).send({
            status: 'success',
            data: categories
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
        const slider = await CategoryRepo.findOne(_id);
        res.status(200).send({
            status: 'success',
            data: slider
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
        const prevCoverImage = category.cover;
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImageData = lib_1.extractImageModel(values[0][0], prevCoverImage.createdAt);
        const data = {
            name: {
                arabic: req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData
        };
        const re = await CategoryRepo.update(_id, data);
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
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.findOne(_id);
        const prevCoverImage = category.cover.name;
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();
        await CategoryRepo.delete(_id);
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
//# sourceMappingURL=category.controller.js.map