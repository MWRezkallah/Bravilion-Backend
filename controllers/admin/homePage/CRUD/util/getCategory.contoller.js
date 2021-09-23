"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = void 0;
const categoryRepository_1 = require("../../../../../repositories/categoryRepository");
const getAllCategories = async (req, res) => {
    var _a;
    try {
        const CategoryRepo = new categoryRepository_1.CategoryRepository();
        if (!CategoryRepo.collection)
            await CategoryRepo.initCollection();
        const categories = await ((_a = CategoryRepo.collection) === null || _a === void 0 ? void 0 : _a.find().toArray());
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
//# sourceMappingURL=getCategory.contoller.js.map