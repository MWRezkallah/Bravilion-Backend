"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopCategoryRepository = void 0;
const _1 = require(".");
const mongodb_1 = require("mongodb");
class TopCategoryRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = 'TopCategory';
    }
    async getTopCategories() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "TopCategories"
                },
            }
        ]).toArray());
    }
    async getTopCategory(id) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "TopCategory"
                },
            },
            {
                $match: {
                    $and: [{ "_id": new mongodb_1.ObjectId(id) }]
                }
            }
        ]).toArray());
    }
}
exports.TopCategoryRepository = TopCategoryRepository;
//# sourceMappingURL=topCategoryRepository.js.map