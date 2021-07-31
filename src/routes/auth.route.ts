import { Router } from 'express';
import { login, signUp } from '../controllers/auth.controller';


// eslint-disable-next-line new-cap
const router = Router();

router.post('/login', login);
router.post('/sign-up', signUp);

export default router;