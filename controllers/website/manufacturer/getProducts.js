"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManufacturerProducts = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getManufacturerProducts = async (req, res) => {
    var _a;
    try {
        const manufacturerID = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const products = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $match: manufacturerID },
            {
                $lookup: {
                    from: "Product",
                    localField: "_id",
                    foreignField: "ownerId",
                    as: "Products"
                }
            },
            { $unwind: "$Products" },
            { $replaceRoot: { "newRoot": "$Products" } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: products
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getManufacturerProducts = getManufacturerProducts;
//# sourceMappingURL=getProducts.js.map