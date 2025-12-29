import * as express from 'express';
const router = express.Router();
import * as restaurantCtrl from '../controllers/restaurant';

router.put('/:id', restaurantCtrl.updateRestaurant);

export default router;