"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const controllers_1 = require("../controllers");
const upload = multer({ storage: multer_1.storage(`${process.env.savingHomeSliderImagePath}`), fileFilter: multer_1.imageFilter });
// eslint-disable-next-line new-cap
const router = express_1.Router();
router.post('/create-slider', upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), controllers_1.createHomeSlider);
router.get('/get-sliders', controllers_1.getAllHomeSliders);
router.get('/get-slider/:id', controllers_1.getHomeSlider);
router.put('/update-slider/:id', upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), controllers_1.updateHomeSlider);
router.delete('/delete-slider/:id', controllers_1.deleteHomeSlider);
exports.default = router;
//# sourceMappingURL=homeSlider.route.js.map