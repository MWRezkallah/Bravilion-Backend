"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = express_1.Router();
router.post('/create-top-category', controllers_1.createTopCategory);
router.get('/get-top-categories', controllers_1.getTopCategories);
router.get('/get-top-category/:id', controllers_1.getTopCategory);
router.put('/update-top-category/:id', controllers_1.updateTopCategory);
router.delete('/delete-top-category/:id', controllers_1.deleteTopCategory);
exports.default = router;
//# sourceMappingURL=topCategory.route.js.map