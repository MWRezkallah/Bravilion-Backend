"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
/* eslint-disable space-before-blocks */
const repository_1 = require("./base/repository");
const bson_1 = require("bson");
class CategoryRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'Category';
    }
    async getCategory(id) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: {
                    "_id": new bson_1.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "_id",
                    foreignField: "parentCategoryId",
                    as: "subCategories"
                },
            },
            { $project: { "subCategories.parentCategoryId": 0 } }
        ]).toArray());
    }
    async getCategories() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Category",
                    localField: "_id",
                    foreignField: "parentCategoryId",
                    as: "subCategories"
                },
            },
            { $project: { "subCategories.parentCategoryId": 0 } }
        ]).toArray());
    }
    async getCategoriesOptions() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $project: { "name": 1, "level": 1 } }
        ]).toArray());
    }
    async getHomeTopCategoriesExcluded() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                '$lookup': {
                    'from': 'HomeTopCategory',
                    'localField': '_id',
                    'foreignField': 'category',
                    'as': 'topcat'
                }
            }, {
                '$addFields': {
                    'isTop': {
                        '$cond': [
                            {
                                '$cmp': [
                                    {
                                        '$size': '$topcat'
                                    }, 0
                                ]
                            }, true, false
                        ]
                    }
                }
            }, {
                '$match': {
                    'isTop': {
                        '$eq': false
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': '_id',
                    'foreignField': 'parentCategoryId',
                    'as': 'subCategories'
                }
            }, {
                '$project': {
                    'subCategories.parentCategoryId': 0,
                    'topcat': 0,
                    'isTop': 0
                }
            }
        ]).toArray());
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=categoryRepository.js.map