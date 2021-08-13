"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const multer = require("multer");
const formDataParser = multer();
const router = express_1.Router();
router.use(formDataParser.none());
router.post('/create-service', controllers_1.createService);
router.get('/get-services', controllers_1.getServices);
router.get('/get-service/:id', controllers_1.getService);
router.put('/update-service/:id', controllers_1.updateService);
router.delete('/delete-service/:id', controllers_1.deleteService);
exports.default = router;
//# sourceMappingURL=service.route.js.map