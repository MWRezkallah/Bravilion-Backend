"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const supplierValidation_1 = require("../middleware/supplierValidation");
const supplier_controller_1 = require("../controllers/supplier.controller");
const upload = multer({ storage: multer_1.storage(`${process.env.suppliersLogoPath}`), fileFilter: multer_1.imageFilter });
const router = express_1.Router();
router.post("/create-supplier", [upload.fields([{ name: "supplierLogo", maxCount: 1 }]), supplierValidation_1.supplierCreationValidator], supplier_controller_1.createSupplier);
router.get("/get-suppliers", supplier_controller_1.getAllSuppliers);
router.get("/get-supplier/:id", supplier_controller_1.getSupplier);
router.put("/update-supplier/:id", [upload.fields([{ name: "supplierLogo", maxCount: 1 }]), supplierValidation_1.supplierUpdateValidator], supplier_controller_1.updateSupplier);
router.delete("/delete-supplier/:id", supplier_controller_1.deleteSupplier);
exports.default = router;
//# sourceMappingURL=supplier.route.js.map