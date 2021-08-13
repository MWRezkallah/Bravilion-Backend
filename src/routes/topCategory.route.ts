import { Router } from "express";
import {  createTopCategory, deleteTopCategory, getTopCategories, getTopCategory, updateTopCategory } from "../controllers";

const router = Router();

router.post('/create-top-category', createTopCategory);
router.get('/get-top-categories', getTopCategories);
router.get('/get-top-category/:id', getTopCategory);
router.put('/update-top-category/:id', updateTopCategory);
router.delete('/delete-top-category/:id', deleteTopCategory);

export default router;