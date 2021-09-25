"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForProduct = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const searchForProduct = async (req, res) => {
    try {
        const prodRepo = new repositories_1.ProductRepository();
        const pipeline = [];
        if (req.body.name) {
            pipeline.push({
                $match: {
                    $or: [
                        { "name.arabic": new RegExp(req.body.name, "i") },
                        { "name.english": new RegExp(req.body.name, "i") }
                    ]
                }
            });
        }
        if (req.body.categories) {
            const categories = [].concat(req.body.categories).map(category => new bson_1.ObjectId(category));
            pipeline.push({
                $match: {
                    "categories": { $in: [...categories] }
                }
            });
        }
        const products = await prodRepo.aggregate(pipeline);
        res.status(200).send({
            status: "Success",
            data: products
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error
        });
    }
};
exports.searchForProduct = searchForProduct;
//# sourceMappingURL=searchForProduct.js.map