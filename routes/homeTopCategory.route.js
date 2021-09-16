"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const multer = require("multer");
const formDataParser = multer();
const router = express_1.Router();
router.use(formDataParser.none());
router.post('/create-home-top-category', controllers_1.createHomeTopCategory);
router.get('/get-home-top-category', controllers_1.getHomeTopCategory);
router.get('/categories-top-excluded', controllers_1.getHomeExcludedTopCategory);
router.put('/update-home-top-category', controllers_1.updateHomeTopCategory);
router.delete('/delete-home-top-category/:id?', controllers_1.deleteHomeTopCategory);
exports.default = router;
//# sourceMappingURL=homeTopCategory.route.js.map