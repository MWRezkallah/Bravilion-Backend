"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProductDetails = exports.getProducts = exports.getProductsDetails = exports.createProduct = void 0;
const repositories_1 = require("../repositories");
const lib_1 = require("../lib");
const mongodb_1 = require("mongodb");
const Storage = require("@google-cloud/storage");
const createProduct = async (req, res) => {
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const productDetailsRepo = new repositories_1.ProductDetailsRepository();
        const productDetailsItem = {
            name: { arabic: req.body.arabicName, english: req.body.englishName },
            description: { arabic: req.body.arabicDescription, english: req.body.englishDescription },
            logo: lib_1.extractImageModel(values[0][0]),
            price: req.body.price,
            afterSalePrice: req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map(image => lib_1.extractImageModel(image)),
            properties: req.body.properties || [],
            detailedProperties: req.body.detailedProperties || [],
            suppliers: [].concat(req.body.supplier).map(supplierId => new mongodb_1.ObjectId(supplierId)),
            categories: [].concat(req.body.categories).map(categoryId => new mongodb_1.ObjectId(categoryId)),
            badges: [].concat(req.body.badges).map(badgeId => new mongodb_1.ObjectId(badgeId))
        };
        const productDetails = await productDetailsRepo.create(productDetailsItem);
        const productRepo = new repositories_1.ProductRepositoryOld();
        const productItem = {
            name: { arabic: req.body.arabicName, english: req.body.englishName },
            description: { arabic: req.body.arabicDescription, english: req.body.englishDescription },
            logo: lib_1.extractImageModel(values[0][0]),
            price: req.body.price,
            afterSalePrice: req.body.afterSalePrice || req.body.price,
            categories: [].concat(req.body.categories).map(categoryId => new mongodb_1.ObjectId(categoryId)),
            badges: [].concat(req.body.badges).map(badgeId => new mongodb_1.ObjectId(badgeId)),
            productDetailsId: productDetails._id
        };
        const product = await productRepo.create(productItem);
        res.status(200).send({
            status: "Success",
            data: productDetails
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createProduct = createProduct;
const getProductsDetails = async (req, res) => {
    try {
        const productDetailsRepo = new repositories_1.ProductDetailsRepository();
        const products = await productDetailsRepo.getProducts();
        res.status(200).send({
            status: "Success",
            data: products
        });
    }
    catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProductsDetails = getProductsDetails;
const getProducts = async (req, res) => {
    try {
        const productRepo = new repositories_1.ProductRepositoryOld();
        const products = await productRepo.getProducts();
        res.status(200).send({
            status: "Success",
            data: products
        });
    }
    catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProducts = getProducts;
const getProductDetails = async (req, res) => {
    try {
        const productDetailsRepo = new repositories_1.ProductDetailsRepository();
        const product = await productDetailsRepo.findOne(req.params.id);
        res.status(200).send({
            status: "Success",
            data: product
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProductDetails = getProductDetails;
const getProduct = async (req, res) => {
    try {
        const productRepo = new repositories_1.ProductRepositoryOld();
        const product = await productRepo.findOne(req.params.id);
        res.status(200).send({
            status: "Success",
            data: product
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProduct = getProduct;
const updateProduct = async (req, res) => {
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const productDetailsRepo = new repositories_1.ProductDetailsRepository();
        const productDetails = await productDetailsRepo.findOne(req.params.id);
        if (!productDetails)
            throw new Error("Product not found!");
        const productDetailsItem = {
            name: { arabic: req.body.arabicName, english: req.body.englishName },
            description: { arabic: req.body.arabicDescription, english: req.body.englishDescription },
            logo: lib_1.extractImageModel(values[0][0], productDetails.logo.createdAt),
            price: req.body.price,
            afterSalePrice: req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map((image, index) => lib_1.extractImageModel(image, productDetails.images[index].createdAt)),
            properties: req.body.properties || [],
            detailedProperties: req.body.detailedProperties || [],
            suppliers: [].concat(req.body.supplier).map(supplierId => new mongodb_1.ObjectId(supplierId)),
            categories: [].concat(req.body.categories).map(categoryId => new mongodb_1.ObjectId(categoryId)),
            badges: [].concat(req.body.badges).map(badgeId => new mongodb_1.ObjectId(badgeId))
        };
        const updatedProductDetails = await productDetailsRepo.update(req.params.id, productDetailsItem);
        const productRepo = new repositories_1.ProductRepositoryOld();
        const productItem = {
            name: productDetailsItem.name,
            description: productDetailsItem.description,
            logo: productDetailsItem.logo,
            price: productDetailsItem.price,
            afterSalePrice: productDetailsItem.afterSalePrice,
            categories: productDetailsItem.categories,
            badges: productDetailsItem.badges,
            productDetailsId: new mongodb_1.ObjectId(productDetails._id)
        };
        const product = await productRepo.findOneByQuery({ productDetailsId: productItem.productDetailsId });
        await productRepo.update(product._id, productItem);
        //if updated delete old images
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(productDetails.logo.name).delete();
        Array.from(productDetails.images).forEach(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());
        res.status(200).send({
            status: "Success",
            data: updatedProductDetails,
        });
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(lib_1.extractImageModel(values[0][0]).name).delete();
        Array.from(values[1]).forEach(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(lib_1.extractImageModel(image).name).delete());
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const productDetailsRepo = new repositories_1.ProductDetailsRepository();
        const productDetails = await productDetailsRepo.findOne(req.params.id);
        await productDetailsRepo.delete(req.params.id);
        const productRepo = new repositories_1.ProductRepositoryOld();
        await productRepo.deleteByQuery({ productDetailsId: productDetails._id });
        //if product is deleted, so we will delete its images
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(productDetails.logo.name).delete();
        Array.from(productDetails.images).forEach(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());
        res.status(200).send({
            status: "success",
            message: `${productDetails.name.english} deleted successfully!`
        });
    }
    catch (err) {
        res.status(400).send({
            status: "Error",
            Error: err
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=oldproduct.controller.js.map