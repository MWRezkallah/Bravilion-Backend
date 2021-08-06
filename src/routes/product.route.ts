import { Router } from "express";
import * as multer from 'multer';
import { imageFilter, storage } from '../lib/multer';
import { createProduct, getProduct, getProducts, getSimpProducts, getSimpProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const upload = multer({storage: storage(`${process.env.productImagesPath}`), fileFilter:imageFilter})

const router = Router();

router.post('/create-product',upload.fields([{name:"logo", maxCount:1}, {name:"images", maxCount:20}]), createProduct);
router.get('/get-products', getProducts);
router.get('/get-simpleproducts', getSimpProducts);
router.get('/get-product/:id', getProduct );
router.get('/get-simpleproduct/:id', getSimpProduct);
router.put('/update-product/:id',upload.fields([{name:"logo", maxCount:1}, {name:"images", maxCount:20}]), updateProduct);
router.delete('/delete-product/:id', deleteProduct);

export default router;