import { Router } from 'express';
import * as multer from 'multer';
import { createHomeSlider } from '../controllers/homeSlider.controller';


const storage =  multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        console.log("=======================> " , file.fieldname + '-' + uniqueSuffix)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage });

// eslint-disable-next-line new-cap
const router = Router();

router.post('/create-slider', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) ,createHomeSlider);
router.post('/create' , createHomeSlider);


export default router;