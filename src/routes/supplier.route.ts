import { Router } from "express";
import * as multer from "multer";
import { imageFilter, storage } from '../lib/multer';
import { supplierCreationValidator, supplierUpdateValidator } from "../middleware/supplierValidation";
import { createSupplier, deleteSupplier, getAllSuppliers, getSupplier, updateSupplier } from "../controllers/supplier.controller";

const upload = multer({storage: storage(`${process.env.suppliersLogoPath}`), fileFilter: imageFilter});

const router = Router();

router.post("/create-supplier", [ upload.fields([{name:"supplierLogo", maxCount:1}]), supplierCreationValidator ], createSupplier);
router.get("/get-suppliers", getAllSuppliers);
router.get("/get-supplier/:id", getSupplier);
router.put("/update-supplier/:id", [ upload.fields([{name:"supplierLogo", maxCount:1}]), supplierUpdateValidator], updateSupplier);
router.delete("/delete-supplier/:id", deleteSupplier);
export default router;