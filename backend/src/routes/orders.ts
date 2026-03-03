import { Router } from 'express';
const router = Router();
import * as orderCtrl from '../controllers/orders';
import {protect} from '../middlewares/auth';

router.get('/', protect, orderCtrl.getAllOrders);
router.get('/:id', protect, orderCtrl.getOneOrder);
router.post('/', protect, orderCtrl.addOrder);
router.patch('/:id', protect, orderCtrl.updateStatus);
router.delete('/:id', protect, orderCtrl.removeOrder);

export default router;
