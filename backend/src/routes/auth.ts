import * as express from 'express';
import * as authCtrl from '../controllers/auth';
import { protect } from '../middlewares/auth';
import { LoginSchema, UserProfileSchema, UserSchema } from '../models/User';
import { validate } from '../utils/validate.middleware';
import multer from '../middlewares/multer-cloudinary-config';
import passport from 'passport';

const router = express.Router();

router.post('/login', validate(LoginSchema), authCtrl.login);
router.post('/register', validate(UserSchema), authCtrl.register);
router.get('/me', protect, authCtrl.authMe);
router.put('/profile', protect, multer, validate(UserProfileSchema), authCtrl.updateUser);
router.put('/updatePassword', protect, authCtrl.updatePassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  const token = authCtrl.generateToken(req.user!._id);
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  res.redirect(`${frontendUrl}/oauthcallbackpage?token=${token}`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
}), (req, res) => {
  const token = authCtrl.generateToken(req.user!._id);
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  res.redirect(`${frontendUrl}/oauthcallbackpage?token=${token}`);
});

export default router;
