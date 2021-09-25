import { Router } from 'express';
import { authorizeAdmin} from '../middleware/admin';
import { createHomePageSection, deleteHomePageSection,getAllCategories,getHomePageSection,
            getHomePageSections,getManufacturers,getProducts,getProjects,reorderSections,updateHomePageSection  } from '../controllers/admin/homePage';
import {getRequestsByStatusForClient, getRequestsByStatusForManufacturer} from '../controllers/admin/requests'

const router = Router();

//home page get-util
router.get("/get-manufacturers", authorizeAdmin, getManufacturers);
router.get("/get-products", authorizeAdmin, getProducts);
router.get("/get-projects", authorizeAdmin, getProjects);
router.get("/get-categories", authorizeAdmin, getAllCategories);

//home page crud
router.post('/homePage/create-section', authorizeAdmin, createHomePageSection);
router.get('/homePage/get-section/:sectionId', authorizeAdmin, getHomePageSection);
router.get('/homePage/get-sections', authorizeAdmin, getHomePageSections);
router.put('/homePage/update-section/:sectionId', authorizeAdmin, updateHomePageSection);
router.delete('/homePage/delete-section/:sectionId', authorizeAdmin, deleteHomePageSection)
router.post('/homePage/reorder-sections', authorizeAdmin, reorderSections);

//requests
router.post('/client-requests/:clientId?', authorizeAdmin, getRequestsByStatusForClient);
router.post('/manufacturer-requests/:manufacturer?', authorizeAdmin, getRequestsByStatusForManufacturer);


export default router;