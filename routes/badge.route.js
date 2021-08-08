"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const multer = require("multer");
const formDataParser = multer();
const router = express_1.Router();
router.use(formDataParser.none());
router.post('/create-badge', controllers_1.createBadge);
router.get('/get-badges', controllers_1.getBadges);
router.get('/get-badge/:id', controllers_1.getBadge);
router.put('/update-badge/:id', controllers_1.updateBadge);
router.delete('/delete-badge/:id', controllers_1.deleteBadge);
exports.default = router;
//# sourceMappingURL=badge.route.js.map