"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const controllers_1 = require("../controllers");
const admin_1 = require("../middleware/admin");
const upload = multer({ storage: multer_1.storage(`${process.env.savingHomePageImages}`), fileFilter: multer_1.imageFilter });
const router = express_1.Router();
router.post('/create-HomePage', [upload.any(), admin_1.authorizeAdmin], controllers_1.createHomePage);
router.get('/get-HomePages', controllers_1.getHomePages);
router.get('/get-HomePage/:id', controllers_1.getHomePage);
router.put('/update-HomePage/:id', [upload.any(), admin_1.authorizeAdmin], controllers_1.updateHomePage);
router.delete('/delete-HomePage/:id', admin_1.authorizeAdmin, controllers_1.deleteHomePage);
exports.default = router;
//# sourceMappingURL=homePage.route.js.map