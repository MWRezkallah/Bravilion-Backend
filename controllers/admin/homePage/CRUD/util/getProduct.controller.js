"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const repositories_1 = require("../../../../../repositories");
const getProducts = async (req, res) => {
    try {
        const prodRepo = new repositories_1.ProductRepository();
        const products = await prodRepo.getAllProducts();
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
//# sourceMappingURL=getProduct.controller.js.map