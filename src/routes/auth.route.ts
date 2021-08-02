import { Router } from 'express';
import { login, logout, signUp } from '../controllers/auth.controller';
import {authCheck} from '../middleware/authCheck'

// eslint-disable-next-line new-cap
const router = Router();

router.post('/login', login);
router.post('/sign-up', signUp);
router.post('/logout', [authCheck], logout);

export default router;