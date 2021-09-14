"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const _1 = require(".");
class ProductRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = "Product";
        this.getProduct = async (id) => {
            var _a, _b;
            if (!this.collection)
                await this.initCollection();
            await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.updateOne({ "_id": id }, { $inc: { "views": 1 } }));
            return await ((_b = this.collection) === null || _b === void 0 ? void 0 : _b.aggregate([
                { $match: { "_id": id } }
            ]).toArray());
        };
        this.getProducts = async () => {
            var _a;
            if (!this.collection)
                await this.initCollection();
            return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate().toArray());
        };
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map