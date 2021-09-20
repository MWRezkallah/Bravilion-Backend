import { Router } from 'express';
import { clientRegister, authenticateClient, authorizeClient, clientUpdate } from '../middleware/client';
import { login, logout, signUp, update, 
    createRequest, updateRequest, deleteRequest, getRequests, getRequest
} from '../controllers/client';
import  * as multer  from 'multer';
import { imageFilter,  storage } from '../lib/multer';



const uploadImage = multer({ storage: storage(`${process.env.clientImages}`), fileFilter: imageFilter } );


const formDataParser = multer();

const router = Router();

//Register & authenticate
router.post('/login', formDataParser.none() , login);
router.post('/signup', [formDataParser.none(), clientRegister], signUp);
router.put('/update', [uploadImage.fields([{name:"avatar",maxCount:1}, {name:"coverImage", maxCount:1}]), clientUpdate], update);
router.post('/logout', [authenticateClient], logout);
// router.get('/get-client/:clientId?', getClient) //todo



//requests 
router.post('/create-request', authorizeClient, createRequest)
router.get('/get-requests/:clientId?',authenticateClient, getRequests) //todo
router.get('/get-request/:requestId',authenticateClient, getRequest)
router.put('/update-request/:requestId', authorizeClient, updateRequest)
router.delete('/delete-request/:requestId', authorizeClient, deleteRequest)


export default router;