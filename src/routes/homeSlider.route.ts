import { Router } from 'express';
import * as multer from 'multer';
import { createHomeSlider, deleteHomeSlider, getAllHomeSliders, getHomeSlider, updateHomeSlider } from '../controllers/homeSlider.controller';

const storage =  multer.diskStorage({
    destination:  (req, file, cb) =>{
        cb(null, '../../tmp/my-uploads')
    },
    filename:  (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/')+1);
        // console.log("===============>" , file)

        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
    }
})

const upload = multer({ storage: storage });

// eslint-disable-next-line new-cap
const router = Router();

router.post('/create-slider', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , createHomeSlider);
router.get('/get-sliders', getAllHomeSliders)
router.get('/get-slider/:id', getHomeSlider)
router.put('/update-slider/:id', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , updateHomeSlider);
router.delete('/delete-slider/:id', deleteHomeSlider)


export default router;