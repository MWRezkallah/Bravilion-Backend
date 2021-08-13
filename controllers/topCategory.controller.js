"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopCategory = exports.updateTopCategory = exports.getTopCategory = exports.getTopCategories = exports.createTopCategory = void 0;
const repositories_1 = require("../repositories/");
const mongodb_1 = require("mongodb");
const createTopCategory = async (req, res) => {
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const catId = new mongodb_1.ObjectId(req.body.categoryId);
        const topCategory = await topCatRepo.findOneByQuery({ categoryId: catId });
        if (topCategory)
            throw new Error(`Category with id ${catId} is already exists in top category`);
        const catRepo = new repositories_1.CategoryRepository();
        const category = await catRepo.findOneByQuery({ _id: catId });
        if (!category)
            throw new Error(`Category with id: ${catId}, doesn't exists in the category collection`);
        const topCat = await topCatRepo.create({ categoryId: catId });
        res.status(200).send({
            status: "Success",
            data: topCat
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createTopCategory = createTopCategory;
const getTopCategories = async (req, res) => {
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const topCategories = await topCatRepo.getTopCategories();
        res.status(200).send({
            status: "success",
            data: topCategories
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getTopCategories = getTopCategories;
const getTopCategory = async (req, res) => {
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const topCategory = await topCatRepo.getTopCategory(req.params.id);
        res.status(200).send({
            status: "success",
            data: topCategory
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getTopCategory = getTopCategory;
const updateTopCategory = async (req, res) => {
    try {
        const catRepo = new repositories_1.CategoryRepository();
        const newCatId = new mongodb_1.ObjectId(req.body.categoryId);
        const category = await catRepo.findOneByQuery({ _id: newCatId });
        if (!category)
            throw new Error(`there is no category with id: ${req.body.categoryId} in the category collection`);
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const catId = new mongodb_1.ObjectId(req.params.id);
        const topCategory = await topCatRepo.findOneByQuery({ categoryId: catId });
        if (!topCategory)
            throw new Error(`Category with id:${req.params.id} doesn't exists in the top category collection`);
        const updatedTopCategory = await topCatRepo.update(topCategory._id, { categoryId: newCatId });
        res.status(200).send({
            status: "success",
            data: updatedTopCategory
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateTopCategory = updateTopCategory;
const deleteTopCategory = async (req, res) => {
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        await topCatRepo.deleteByQuery({ categoryId: new mongodb_1.ObjectId(req.params.id) });
        res.status(200).send({
            status: "success",
            message: `category with id: ${req.params.id} deleted successfully`
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteTopCategory = deleteTopCategory;
//# sourceMappingURL=topCategory.controller.js.map