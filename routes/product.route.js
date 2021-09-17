"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const product_1 = require("../controllers/product");
const Manufacturer_1 = require("../middleware/Manufacturer");
const upload = multer({ storage: multer_1.storage(`${process.env.productImagesPath}`), fileFilter: multer_1.imageFilter });
const router = express_1.Router();
router.post('/create-product', [upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "gallery", maxCount: 20 }]), Manufacturer_1.authorizeManufacturer], product_1.createProduct);
router.get('/get-product/:productId', Manufacturer_1.authorizeManufacturer, product_1.getProduct);
router.get('/get-products', Manufacturer_1.authorizeManufacturer, product_1.getProducts);
router.put('/update-product/:productId', [upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "gallery", maxCount: 20 }]), Manufacturer_1.authorizeManufacturer], product_1.updateProduct);
router.delete('/delete-product/:productId', Manufacturer_1.authorizeManufacturer, product_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.route.js.map