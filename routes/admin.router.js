"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../middleware/admin");
const homePage_1 = require("../controllers/admin/homePage");
const router = express_1.Router();
//home page get-util
router.get("/get-manufacturers", admin_1.authorizeAdmin, homePage_1.getManufacturers);
router.get("/get-products", admin_1.authorizeAdmin, homePage_1.getProducts);
router.get("/get-projects", admin_1.authorizeAdmin, homePage_1.getProjects);
router.get("/get-categories", admin_1.authorizeAdmin, homePage_1.getAllCategories);
//home page crud
router.post('/homePage/create-section', admin_1.authorizeAdmin, homePage_1.createHomePageSection);
router.get('/homePage/get-section/:sectionId', admin_1.authorizeAdmin, homePage_1.getHomePageSection);
router.get('/homePage/get-sections', admin_1.authorizeAdmin, homePage_1.getHomePageSections);
router.put('/homePage/update-section/:sectionId', admin_1.authorizeAdmin, homePage_1.updateHomePageSection);
router.delete('/homePage/delete-section/:sectionId', admin_1.authorizeAdmin, homePage_1.deleteHomePageSection);
router.post('/homePage/reorder-sections', admin_1.authorizeAdmin, homePage_1.reorderSections);
exports.default = router;
//# sourceMappingURL=admin.router.js.map