"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const multer = require("multer");
const formDataParser = multer();
const router = express_1.Router();
router.use(formDataParser.none());
router.post('/create-plan', controllers_1.createPlan);
router.get('/get-plans', controllers_1.getPlans);
router.get('/get-plan/:id', controllers_1.getPlan);
router.put('/update-plan/:id', controllers_1.updatePlan);
router.delete('/delete-plan/:id', controllers_1.deletePlan);
exports.default = router;
//# sourceMappingURL=plan.route.js.map