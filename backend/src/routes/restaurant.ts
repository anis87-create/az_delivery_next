import * as express from 'express';
const router = express.Router();
import * as restaurantCtrl from '../controllers/restaurant';
import protect from '../middlewares/auth';
import  multer from '../middlewares/multer-config';


router.put('/:id', protect, multer, restaurantCtrl.updateRestaurant);

export default router;