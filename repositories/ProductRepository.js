"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const _1 = require(".");
class ProductRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = "Product";
        this.getProduct = async (productId, manufacturerId) => {
            var _a;
            if (!this.collection)
                await this.initCollection();
            // await this.collection?.updateOne({"_id":productId}, {$inc:{"views":1}});
            return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
                { $match: { $and: [{ "_id": productId }, { ownerId: manufacturerId }] } }
            ]).toArray());
        };
        this.getProducts = async (manufacturerId) => {
            var _a;
            if (!this.collection)
                await this.initCollection();
            return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([{ $match: { ownerId: manufacturerId } }]).toArray());
        };
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map