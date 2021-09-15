import { Router } from "express";
import {  createHomeTopCategory, deleteHomeTopCategory, getTopCategories, getHomeTopCategory, updateHomeTopCategory } from "../controllers";
import  * as multer  from 'multer';
const formDataParser = multer();

const router = Router();

router.use(formDataParser.none());
router.post('/create-home-top-category', createHomeTopCategory);
router.get('/get-home-top-category', getHomeTopCategory);
router.put('/update-home-top-category', updateHomeTopCategory);
router.delete('/delete-home-top-category', deleteHomeTopCategory);

export default router;