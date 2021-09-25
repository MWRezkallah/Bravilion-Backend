import { Router } from 'express';
import {getHomePageAssets,getHomePageSections, getAllCategories,
        getProductFull, searchForProduct,
        getManufacturer, getVideos, getCatalogues, getManufacturerProducts,
        getFamilies, getFamily,
        getCollections, getCollection,
        getProjects, getProject } from '../controllers/website';

const router = Router();

//homePage
router.get('/home-page-assets', getHomePageAssets)
router.get('/home-page-sections', getHomePageSections);

//product
router.get('/product/:productId', getProductFull);

//search product
router.get('/search-for-product', searchForProduct);
router.get('/categories', getAllCategories)

//manufacturer
router.get('/manufacturer/:manufacturerId?', getManufacturer);
router.get('/manufacturer/videos/:manufacturerId?', getVideos);
router.get('/manufacturer/catalogues/:manufacturerId?', getCatalogues);
router.get('/manufacturer/products/:manufacturerId?', getManufacturerProducts);

router.get('/manufacturer/families/:manufacturerId?', getFamilies);
router.get('/manufacturer/family/:familyId?', getFamily);


router.get('/manufacturer/collections/:manufacturerId?', getCollections);
router.get('/manufacturer/collection/:collectionId?', getCollection);


router.get('/manufacturer/projects/:manufacturerId?', getProjects);
router.get('/manufacturer/project/:projectId?', getProject);
export default router;