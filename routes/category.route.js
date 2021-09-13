"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const category_controller_1 = require("../controllers/category.controller");
const multer_1 = require("../lib/multer");
const upload = multer({ storage: multer_1.storage(`${process.env.savingCategoryImagesPath}`), fileFilter: multer_1.imageFilter });
// eslint-disable-next-line new-cap
const router = express_1.Router();
router.post('/create-category', upload.fields([{ name: 'coverImage', maxCount: 1 }]), category_controller_1.createCategory);
router.get('/get-categories', category_controller_1.getAllCategories);
router.get('/get-categories-options', category_controller_1.getAllCategoriesOptions);
router.get('/get-category/:id', category_controller_1.getCategory);
router.put('/update-category/:id', upload.fields([{ name: 'coverImage', maxCount: 1 }]), category_controller_1.updateCategory);
router.delete('/delete-category/:id', category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.route.js.map