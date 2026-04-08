import { Router } from 'express';
const router = Router();
import * as orderCtrl from '../controllers/orders';
import {protect} from '../middlewares/auth';
import { validate, validateStatus } from '../utils/validate.middleware';
import { StatusZodSchema, OrderZodSchema } from '../models/Order';

router.get('/', protect, orderCtrl.getAllOrders);
router.get('/:id', protect, orderCtrl.getOneOrder);
router.post('/', protect, validate(OrderZodSchema), orderCtrl.addOrder);
router.patch('/:id', protect, validateStatus(StatusZodSchema), orderCtrl.updateStatus);
router.delete('/:id', protect, orderCtrl.removeOrder);

export default router;
