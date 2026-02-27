import * as express from 'express';
import * as cartItemsCtrl from '../controllers/cartItems';
import {protect} from '../middlewares/auth';
const router = express.Router();

router.get('/', protect,  cartItemsCtrl.getAllCartItems);
router.patch('/:id/increment', protect, cartItemsCtrl.incrementCartItem);
router.patch('/:id/decrement', protect, cartItemsCtrl.decrementCartItem);
router.patch('/:id/clearItems', protect, cartItemsCtrl.removeCartItem);

export default router;