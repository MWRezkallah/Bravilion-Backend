import { Router, Request } from 'express';
import * as multer from 'multer';
import { imageFilter, storage } from '../lib/multer';
import { createHomePage, deleteHomePage, getHomePages, getHomePage, updateHomePage } from '../controllers';
import { authorizeAdmin } from '../middleware/admin';

const upload = multer({ storage: storage(`${process.env.savingHomePageImages}`), fileFilter: imageFilter } );
const router = Router();

router.post('/create-HomePage', [upload.any(), authorizeAdmin] , createHomePage);
router.get('/get-HomePages', getHomePages)
router.get('/get-HomePage/:id', getHomePage)
router.put('/update-HomePage/:id', [upload.any(), authorizeAdmin] , updateHomePage);
router.delete('/delete-HomePage/:id',authorizeAdmin, deleteHomePage)


export default router;