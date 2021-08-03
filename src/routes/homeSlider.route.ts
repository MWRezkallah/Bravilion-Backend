import { Router, Request } from 'express';
import * as multer from 'multer';
import { createHomeSlider, deleteHomeSlider, getAllHomeSliders, getHomeSlider, updateHomeSlider } from '../controllers/homeSlider.controller';
import * as path from 'path';

const storage =  multer.diskStorage({
    destination: `${process.env.multerStorage}` //note that this path is relative from where you run the command/server not from the route directory
    ,
    filename:  (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/')+1);
        // console.log("===============>" , file)

        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
    }
})

const imageFilter = (req : Request, file: Express.Multer.File, cb : multer.FileFilterCallback ) => {

    const allowedFormats = /jpg|jpeg|png|gif/i ;
    const mimeType = allowedFormats.test(file.mimetype);
    const userExtension = allowedFormats.test(path.extname(file.originalname));

    if( mimeType && userExtension){
         cb(null, true);
    }else{
         cb(null, false);
    }

}

const upload = multer({ storage: storage, fileFilter: imageFilter } );

// eslint-disable-next-line new-cap
const router = Router();

router.post('/create-slider', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , createHomeSlider);
router.get('/get-sliders', getAllHomeSliders)
router.get('/get-slider/:id', getHomeSlider)
router.put('/update-slider/:id', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , updateHomeSlider);
router.delete('/delete-slider/:id', deleteHomeSlider)


export default router;