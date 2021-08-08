import { Router, Request } from 'express';
import * as multer from 'multer';
// import { createHomeSlider, deleteHomeSlider, getAllHomeSliders, getHomeSlider, updateHomeSlider } from '../controllers/homeSlider.controller';
import * as path from 'path';
import { imageFilter, storage } from '../lib/multer';
import { createHomeSlider, deleteHomeSlider, getAllHomeSliders, getHomeSlider, updateHomeSlider } from '../controllers';


const upload = multer({ storage: storage(`${process.env.savingHomeSliderImagePath}`), fileFilter: imageFilter } );

// eslint-disable-next-line new-cap
const router = Router();

router.post('/create-slider', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , createHomeSlider);
router.get('/get-sliders', getAllHomeSliders)
router.get('/get-slider/:id', getHomeSlider)
router.put('/update-slider/:id', upload.fields([{name: 'desktopImage',maxCount: 1},{name: 'mobileImage',maxCount: 1}]) , updateHomeSlider);
router.delete('/delete-slider/:id', deleteHomeSlider)


export default router;