import * as express from 'express';
import * as  authCtrl from '../controllers/auth';
import {protect} from '../middlewares/auth';
import { LoginSchema, UserSchema } from '../models/User';
import { validate } from '../utils/validate.middleware';
const router = express.Router();
router.post('/login', validate(LoginSchema), authCtrl.login);
router.post('/register', validate(UserSchema), authCtrl.register);
router.get('/me',protect, authCtrl.authMe);

export default router;