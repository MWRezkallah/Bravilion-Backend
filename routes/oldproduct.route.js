"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const oldproduct_controller_1 = require("../controllers/oldproduct.controller");
const upload = multer({ storage: multer_1.storage(`${process.env.productImagesPath}`), fileFilter: multer_1.imageFilter });
const router = express_1.Router();
router.post('/create-product', upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 20 }]), oldproduct_controller_1.createProduct);
router.get('/get-products', oldproduct_controller_1.getProducts);
router.get('/get-productsDetails', oldproduct_controller_1.getProductsDetails);
router.get('/get-product/:id', oldproduct_controller_1.getProduct);
router.get('/get-productDetails/:id', oldproduct_controller_1.getProductDetails);
router.put('/update-product/:id', upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 20 }]), oldproduct_controller_1.updateProduct);
router.delete('/delete-product/:id', oldproduct_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=oldproduct.route.js.map