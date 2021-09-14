import { Router } from "express";
import * as multer from 'multer';
import { imageFilter, storage } from '../lib/multer';
import { createProduct,getProduct, getProducts, deleteProduct, updateProduct } from "../controllers/product";
import { authorizeManufacturer } from "../middleware/Manufacturer";
const upload = multer({storage: storage(`${process.env.productImagesPath}`), fileFilter:imageFilter})

const router = Router();

router.post('/create-product',[upload.fields([{name:"coverImage", maxCount:1}, {name:"gallery", maxCount:20}]), authorizeManufacturer], createProduct);
router.get('/get-product/:productId', getProduct );
router.get('/get-products', getProducts );
router.put('/update-product/:productId',[upload.fields([{name:"coverImage", maxCount:1}, {name:"gallery", maxCount:20}]), authorizeManufacturer], updateProduct);
router.delete('/delete-product/:productId', authorizeManufacturer, deleteProduct );

export default router;