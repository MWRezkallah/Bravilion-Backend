"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopCategory = exports.updateTopCategory = exports.getTopCategory = exports.getTopCategories = exports.createTopCategory = void 0;
const repositories_1 = require("../repositories/");
const bson_1 = require("bson");
const createTopCategory = async (req, res) => {
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const topcategory = {
            name: req.body.name,
        };
        if (req.body.parent)
            topcategory["parent"] = new bson_1.ObjectId(req.body.parent);
        req.body.childern ? topcategory["childern"] = (req.body.childern.map(child => new bson_1.ObjectId(child))) : [];
        const topCat = await topCatRepo.create(topcategory);
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
    var _a;
    try {
        const topCatID = new bson_1.ObjectId(req.params.id);
        const topCatRepo = new repositories_1.TopCategoryRepository();
        const topcategory = {
            name: req.body.name,
        };
        if (req.body.parent)
            topcategory["parent"] = new bson_1.ObjectId(req.body.parent);
        req.body.childern ? topcategory["childern"] = (req.body.childern.map(child => new bson_1.ObjectId(child))) : [];
        if (!topCatRepo.collection)
            await topCatRepo.initCollection();
        const topCat = await ((_a = topCatRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": topCatID }, { $set: Object.assign({}, topcategory) }));
        res.status(200).send({
            status: "Success",
            data: topCat === null || topCat === void 0 ? void 0 : topCat.value
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
    var _a;
    try {
        const topCatRepo = new repositories_1.TopCategoryRepository();
        if (!topCatRepo.collection)
            await topCatRepo.initCollection();
        await ((_a = topCatRepo.collection) === null || _a === void 0 ? void 0 : _a.deleteOne({ "_id": new bson_1.ObjectId(req.params.id) }));
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