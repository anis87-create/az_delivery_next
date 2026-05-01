import * as express from 'express';
import * as  authCtrl from '../controllers/auth';
import {protect} from '../middlewares/auth';
import { LoginSchema, UserProfileSchema, UserSchema,  } from '../models/User';
import { validate } from '../utils/validate.middleware';
const router = express.Router();
import  multer from '../middlewares/multer-cloudinary-config';
import  passport from 'passport';
router.post('/login', validate(LoginSchema), authCtrl.login);
router.post('/register', validate(UserSchema), authCtrl.register);
router.get('/me',protect, authCtrl.authMe);
router.put('/profile',protect, multer, validate(UserProfileSchema), authCtrl.updateUser);
router.put('/updatePassword', protect, authCtrl.updatePassword);
router.get('/google', protect, passport.authenticate('google', {scope: ['profile', 'email']}) );
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect:'/'
}), (req,res) => {
    const token = authCtrl.generateToken(req.user!._id);
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`); 
})

export default router;