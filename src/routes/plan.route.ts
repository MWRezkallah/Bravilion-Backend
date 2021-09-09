import {Router} from 'express';
import { createPlan, deletePlan, getPlan, getPlans, updatePlan } from '../controllers';
import  * as multer  from 'multer';


const formDataParser = multer();

const router = Router();

router.use(formDataParser.none());
router.post('/create-plan', createPlan);
router.get('/get-plans', getPlans);
router.get('/get-plan/:id', getPlan);
router.put('/update-plan/:id', updatePlan);
router.delete('/delete-plan/:id', deletePlan);

export default router;