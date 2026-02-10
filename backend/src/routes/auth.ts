import * as express from 'express';
import * as  authCtrl from '../controllers/auth';
import {protect} from '../middlewares/auth';
const router = express.Router();
router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/me',protect, authCtrl.authMe);

export default router;