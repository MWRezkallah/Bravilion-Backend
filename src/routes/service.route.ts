import {Router} from 'express';
import { createService, deleteService, getService, getServices, updateService } from '../controllers';
import  * as multer  from 'multer';


const formDataParser = multer();

const router = Router();

router.use(formDataParser.none());
router.post('/create-service', createService);
router.get('/get-services', getServices);
router.get('/get-service/:id', getService);
router.put('/update-service/:id', updateService);
router.delete('/delete-service/:id', deleteService);

export default router;