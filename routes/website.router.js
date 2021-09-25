"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const website_1 = require("../controllers/website");
const router = express_1.Router();
//homePage
router.get('/home-page-assets', website_1.getHomePageAssets);
router.get('/home-page-sections', website_1.getHomePageSections);
//product
router.get('/product/:productId', website_1.getProductFull);
//search product
router.get('/search-for-product', website_1.searchForProduct);
router.get('/categories', website_1.getAllCategories);
//manufacturer
router.get('/manufacturer/:manufacturerId?', website_1.getManufacturer);
router.get('/manufacturer/videos/:manufacturerId?', website_1.getVideos);
router.get('/manufacturer/catalogues/:manufacturerId?', website_1.getCatalogues);
router.get('/manufacturer/products/:manufacturerId?', website_1.getManufacturerProducts);
router.get('/manufacturer/families/:manufacturerId?', website_1.getFamilies);
router.get('/manufacturer/family/:familyId?', website_1.getFamily);
router.get('/manufacturer/collections/:manufacturerId?', website_1.getCollections);
router.get('/manufacturer/collection/:collectionId?', website_1.getCollection);
router.get('/manufacturer/projects/:manufacturerId?', website_1.getProjects);
router.get('/manufacturer/project/:projectId?', website_1.getProject);
exports.default = router;
//# sourceMappingURL=website.router.js.map