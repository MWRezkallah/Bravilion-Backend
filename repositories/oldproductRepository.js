"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepositoryOld = void 0;
const mongodb_1 = require("mongodb");
const _1 = require(".");
class ProductRepositoryOld extends _1.Repository {
    constructor() {
        super();
        this.collectionName = "ProductOld";
    }
    async getProduct(id) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Badge",
                    localField: "badges",
                    foreignField: "_id",
                    as: "badgeInfo"
                },
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            {
                $match: {
                    $and: [{ "_id": new mongodb_1.ObjectId(id) }]
                }
            }
        ]).toArray());
    }
    async getProducts() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Badge",
                    localField: "badges",
                    foreignField: "_id",
                    as: "badgeInfo"
                },
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            }
        ]).toArray());
    }
}
exports.ProductRepositoryOld = ProductRepositoryOld;
//# sourceMappingURL=oldproductRepository.js.map