import * as express from 'express';
const router = express.Router();
import * as restaurantCtrl from '../controllers/restaurant';
import {protect} from '../middlewares/auth';
import  multer from '../middlewares/multer-cloudinary-config';
import { validate } from '../utils/validate.middleware';
import { RestaurantSchema } from '../models/Restaurant';


router.put('/:id',  protect, validate(RestaurantSchema), multer, restaurantCtrl.updateRestaurant);
router.get('/all', restaurantCtrl.getAllRestaurants);
router.get('/:id', restaurantCtrl.getOneRestaurant)

export default router;