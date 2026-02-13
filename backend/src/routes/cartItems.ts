import * as express from 'express';
import * as cartItemsCtrl from '../controllers/cartItems';
import {protect} from '../middlewares/auth';
const router = express.Router();

router.get('/', protect,  cartItemsCtrl.getAllCartItems);
router.patch('/:id', protect, cartItemsCtrl.addToCartItem);
router.delete('/:id', protect, cartItemsCtrl.removeCartItem);

export default router;