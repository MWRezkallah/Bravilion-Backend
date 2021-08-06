import {Router} from 'express';
import { createBadge, deleteBadge, getBadge, getBadges, updateBadge } from '../controllers';
import  * as multer  from 'multer';


const formDataParser = multer();

const router = Router();

router.use(formDataParser.none());
router.post('/create-badge', createBadge);
router.get('/get-badges', getBadges);
router.get('/get-badge/:id', getBadge);
router.put('/update-badge/:id', updateBadge);
router.delete('/delete-badge/:id', deleteBadge);

export default router;