"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDetailsRepository = void 0;
const mongodb_1 = require("mongodb");
const _1 = require(".");
class ProductDetailsRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = "ProductDetails";
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
                $lookup: {
                    from: "Supplier",
                    localField: "suppliers",
                    foreignField: "_id",
                    as: "supplierInfo"
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
            },
            {
                $lookup: {
                    from: "Supplier",
                    localField: "suppliers",
                    foreignField: "_id",
                    as: "supplierInfo"
                }
            }
        ]).toArray());
    }
}
exports.ProductDetailsRepository = ProductDetailsRepository;
//# sourceMappingURL=productDetailsRepository.js.map