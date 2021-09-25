"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductFull = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getProductFull = async (req, res) => {
    try {
        const productId = new bson_1.ObjectId(req.params.productId);
        const prodRepo = new repositories_1.ProductRepository();
        const product = await prodRepo.getProductFull(productId);
        res.status(200).send({
            status: "Success",
            data: product
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error
        });
    }
};
exports.getProductFull = getProductFull;
//# sourceMappingURL=getProductPage.js.map