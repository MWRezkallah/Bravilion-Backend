import { Router } from 'express';
import * as multer from 'multer';
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory, getAllCategoriesOptions } from '../controllers/category.controller';
import { imageFilter, storage } from '../lib/multer';



const upload = multer({ storage: storage(`${process.env.savingCategoryImagesPath}`), fileFilter: imageFilter } );

// eslint-disable-next-line new-cap
const router = Router();

router.post('/create-category', upload.fields([{name: 'coverImage',maxCount: 1}, {name:'icon', maxCount:1}]) , createCategory);
router.get('/get-categories', getAllCategories)
router.get('/get-categories-options', getAllCategoriesOptions)

router.get('/get-category/:id', getCategory)
router.put('/update-category/:id', upload.fields([{name: 'coverImage',maxCount: 1}, {name:'icon', maxCount:1}]) , updateCategory);
router.delete('/delete-category/:id', deleteCategory)


export default router;