"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.getProduct = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getProduct = async (req, res) => {
    try {
        const productId = new bson_1.ObjectId(req.params.productId);
        const prodRepo = new repositories_1.ProductRepository();
        const product = await prodRepo.getProduct(productId);
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
exports.getProduct = getProduct;
const getProducts = async (req, res) => {
    try {
        const prodRepo = new repositories_1.ProductRepository();
        const products = await prodRepo.getProducts();
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
exports.getProducts = getProducts;
//# sourceMappingURL=read.js.map