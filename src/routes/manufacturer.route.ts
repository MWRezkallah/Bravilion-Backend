import { Router } from 'express';
import { manuRegister, authenticateManufacturer, authorizeManufacturer, manuUpdate } from '../middleware/Manufacturer';
import { login, logout, signUp, update, getManufacturer,
    createVideo, getVideos, getVideo, updateVideo, deleteVideo, 
    createProject, deleteProject, updateProject, getProject, getProjects,
    createEnquiry, deleteEnquiry, updateEnquiry, getEnquiryies, getEnquiry,
    createCatalogue, getCatalogue, getCatalogues, updateCatalogue, deleteCatalogue,
    createCollection, updateCollection, deleteCollection, getCollection, getCollections,
    createFamily, updateFamily, deleteFamily, getFamily, getFamilies} from '../controllers/manufacturer';
import  * as multer  from 'multer';
import { imageFilter, pdfFilter, storage } from '../lib/multer';



const uploadImage = multer({ storage: storage(`${process.env.manufacturerImages}`), fileFilter: imageFilter } );


const formDataParser = multer();

const router = Router();

//Register & authenticate
router.post('/login', formDataParser.none() , login);
router.post('/signup', [formDataParser.none(), manuRegister], signUp);
router.put('/update', [uploadImage.fields([{name:"logo",maxCount:1}, {name:"header", maxCount:1}]), manuUpdate], update);
router.post('/logout', [authenticateManufacturer], logout);
router.get('/get-manufacturer:manufacturerId?', getManufacturer)

//videos
router.post('/create-video', authorizeManufacturer, createVideo)
router.get('/get-videos/:manufacturerId?', getVideos)
router.get('/get-video/:videoId', getVideo)
router.put('/update-video/:videoId', authorizeManufacturer, updateVideo)
router.delete('/delete-video/:videoId', authorizeManufacturer, deleteVideo)

//projects
router.post('/create-project', authorizeManufacturer, createProject)
router.get('/get-projects/:manufacturerId?', getProjects)
router.get('/get-project/:projectId', getProject)
router.put('/update-project/:projectId', authorizeManufacturer, updateProject)
router.delete('/delete-project/:projectId', authorizeManufacturer, deleteProject)

//enquiries 
router.post('/create-enquiry', authorizeManufacturer, createEnquiry)
router.get('/get-enquiries/:manufacturerId?', getEnquiryies)
router.get('/get-enquiry/:enquiryId', getEnquiry)
router.put('/update-enquiry/:enquiryId', authorizeManufacturer, updateEnquiry)
router.delete('/delete-enquiry/:enquiryId', authorizeManufacturer, deleteEnquiry)
// router.post('/create-:property(projects||enquiries)', (req, res)=>{ console.log(req.params); res.send(req.params)})


const uploadPdf = multer({ storage: storage(`${process.env.manufacturerCataloguesPdf}`), fileFilter: pdfFilter } );

//catalogues
router.post('/create-catalogue', [uploadPdf.fields([{name:"pdf", maxCount:1}]), authorizeManufacturer], createCatalogue)
router.get('/get-catalogues/:manufacturerId?', getCatalogues)
router.get('/get-catalogue/:catalogueId', getCatalogue)
router.put('/update-catalogue/:catalogueId', [uploadPdf.fields([{name:"pdf", maxCount:1}]) ,authorizeManufacturer], updateCatalogue)
router.delete('/delete-catalogue/:catalogueId', authorizeManufacturer, deleteCatalogue)

// catalogues?:{name:string, pdf:IFile, description:string}[],

//collection
router.post('/create-collection', [uploadImage.fields([{name:"coverImage", maxCount:1}]), authorizeManufacturer], createCollection)
router.get('/get-collections/:manufacturerId?', getCollections)
router.get('/get-collection/:collectionId', getCollection)
router.put('/update-collection/:collectionId', [uploadImage.fields([{name:"coverImage", maxCount:1}]) ,authorizeManufacturer], updateCollection)
router.delete('/delete-collection/:collectionId', authorizeManufacturer, deleteCollection)

//family
router.post('/create-family', [uploadImage.fields([{name:"coverImage", maxCount:1}]), authorizeManufacturer], createFamily)
router.get('/get-families/:manufacturerId?', getFamilies)
router.get('/get-family/:familyId', getFamily)
router.put('/update-family/:familyId', [uploadImage.fields([{name:"coverImage", maxCount:1}]) ,authorizeManufacturer], updateFamily)
router.delete('/delete-family/:familyId', authorizeManufacturer, deleteFamily)

// todo
//articles
//fairs
//orders

export default router;