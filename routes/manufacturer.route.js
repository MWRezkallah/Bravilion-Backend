"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Manufacturer_1 = require("../middleware/Manufacturer");
const manufacturer_1 = require("../controllers/manufacturer");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const uploadImage = multer({ storage: multer_1.storage(`${process.env.manufacturerImages}`), fileFilter: multer_1.imageFilter });
const formDataParser = multer();
const router = express_1.Router();
//Register & authenticate
router.post('/login', formDataParser.none(), manufacturer_1.login);
router.post('/signup', [formDataParser.none(), Manufacturer_1.manuRegister], manufacturer_1.signUp);
router.put('/update', [uploadImage.fields([{ name: "logo", maxCount: 1 }, { name: "header", maxCount: 1 }]), Manufacturer_1.manuUpdate], manufacturer_1.update);
router.post('/logout', [Manufacturer_1.authenticateManufacturer], manufacturer_1.logout);
router.get('/get-manufacturer:manufacturerId?', manufacturer_1.getManufacturer);
//videos
router.post('/create-video', Manufacturer_1.authorizeManufacturer, manufacturer_1.createVideo);
router.get('/get-videos/:manufacturerId?', manufacturer_1.getVideos);
router.get('/get-video/:videoId', manufacturer_1.getVideo);
router.put('/update-video/:videoId', Manufacturer_1.authorizeManufacturer, manufacturer_1.updateVideo);
router.delete('/delete-video/:videoId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteVideo);
//projects
router.post('/create-project', Manufacturer_1.authorizeManufacturer, manufacturer_1.createProject);
router.get('/get-projects/:manufacturerId?', manufacturer_1.getProjects);
router.get('/get-project/:projectId', manufacturer_1.getProject);
router.put('/update-project/:projectId', Manufacturer_1.authorizeManufacturer, manufacturer_1.updateProject);
router.delete('/delete-project/:projectId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteProject);
//enquiries 
router.post('/create-enquiry', Manufacturer_1.authorizeManufacturer, manufacturer_1.createEnquiry);
router.get('/get-enquiries/:manufacturerId?', manufacturer_1.getEnquiryies);
router.get('/get-enquiry/:enquiryId', manufacturer_1.getEnquiry);
router.put('/update-enquiry/:enquiryId', Manufacturer_1.authorizeManufacturer, manufacturer_1.updateEnquiry);
router.delete('/delete-enquiry/:enquiryId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteEnquiry);
// router.post('/create-:property(projects||enquiries)', (req, res)=>{ console.log(req.params); res.send(req.params)})
const uploadPdf = multer({ storage: multer_1.storage(`${process.env.manufacturerCataloguesPdf}`), fileFilter: multer_1.pdfFilter });
//catalogues
router.post('/create-catalogue', [uploadPdf.fields([{ name: "pdf", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.createCatalogue);
router.get('/get-catalogues/:manufacturerId?', manufacturer_1.getCatalogues);
router.get('/get-catalogue/:catalogueId', manufacturer_1.getCatalogue);
router.put('/update-catalogue/:catalogueId', [uploadPdf.fields([{ name: "pdf", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.updateCatalogue);
router.delete('/delete-catalogue/:catalogueId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteCatalogue);
// catalogues?:{name:string, pdf:IFile, description:string}[],
//collection
router.post('/create-collection', [uploadImage.fields([{ name: "coverImage", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.createCollection);
router.get('/get-collections/:manufacturerId?', manufacturer_1.getCollections);
router.get('/get-collection/:collectionId', manufacturer_1.getCollection);
router.put('/update-collection/:collectionId', [uploadImage.fields([{ name: "coverImage", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.updateCollection);
router.delete('/delete-collection/:collectionId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteCollection);
//family
router.post('/create-family', [uploadImage.fields([{ name: "coverImage", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.createFamily);
router.get('/get-families/:manufacturerId?', manufacturer_1.getFamilies);
router.get('/get-family/:familyId', manufacturer_1.getFamily);
router.put('/update-family/:familyId', [uploadImage.fields([{ name: "coverImage", maxCount: 1 }]), Manufacturer_1.authorizeManufacturer], manufacturer_1.updateFamily);
router.delete('/delete-family/:familyId', Manufacturer_1.authorizeManufacturer, manufacturer_1.deleteFamily);
// todo
//articles
//fairs
//orders
exports.default = router;
//# sourceMappingURL=manufacturer.route.js.map