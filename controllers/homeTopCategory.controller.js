"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomeTopCategory = exports.updateHomeTopCategory = exports.getHomeExcludedTopCategory = exports.getHomeTopCategory = exports.createHomeTopCategory = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../repositories");
const createHomeTopCategory = async (req, res) => {
    var _a;
    try {
        const categories = [].concat(req.body.category).map(cat => { return { "category": new bson_1.ObjectId(cat) }; });
        console.log(categories);
        console.log(req.body.category);
        const homeTopCat = new repositories_1.HomeTopCategoryRepository();
        if (!homeTopCat.collection)
            await homeTopCat.initCollection();
        const result = await ((_a = homeTopCat.collection) === null || _a === void 0 ? void 0 : _a.insertMany(categories));
        res.status(200).send({
            status: "Success",
            message: result
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createHomeTopCategory = createHomeTopCategory;
const getHomeTopCategory = async (req, res) => {
    try {
        const homeTopCat = new repositories_1.HomeTopCategoryRepository();
        if (!homeTopCat.collection)
            await homeTopCat.initCollection();
        const categories = await homeTopCat.getHomeTopCategories();
        res.status(200).send({
            status: "Success",
            data: categories
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getHomeTopCategory = getHomeTopCategory;
const getHomeExcludedTopCategory = async (req, res) => {
    try {
        const homeTopCat = new repositories_1.CategoryRepository();
        if (!homeTopCat.collection)
            await homeTopCat.initCollection();
        const categories = await homeTopCat.getHomeTopCategoriesExcluded();
        res.status(200).send({
            status: "Success",
            data: categories
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getHomeExcludedTopCategory = getHomeExcludedTopCategory;
const updateHomeTopCategory = async (req, res) => {
    var _a, _b;
    try {
        const categories = [].concat(req.body.category).map(cat => { return { "category": new bson_1.ObjectId(cat) }; });
        const homeTopCat = new repositories_1.HomeTopCategoryRepository();
        if (!homeTopCat.collection)
            await homeTopCat.initCollection();
        await ((_a = homeTopCat.collection) === null || _a === void 0 ? void 0 : _a.deleteMany({}));
        const result = await ((_b = homeTopCat.collection) === null || _b === void 0 ? void 0 : _b.insertMany(categories));
        res.status(200).send({
            status: "Success",
            message: result
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateHomeTopCategory = updateHomeTopCategory;
const deleteHomeTopCategory = async (req, res) => {
    var _a;
    try {
        let filter = {};
        if (req.params.id) {
            filter = { "category": new bson_1.ObjectId(req.params.id) };
        }
        const homeTopCat = new repositories_1.HomeTopCategoryRepository();
        if (!homeTopCat.collection)
            await homeTopCat.initCollection();
        const result = await ((_a = homeTopCat.collection) === null || _a === void 0 ? void 0 : _a.deleteMany(filter));
        res.status(200).send({
            status: "Success",
            message: result
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteHomeTopCategory = deleteHomeTopCategory;
//# sourceMappingURL=homeTopCategory.controller.js.map