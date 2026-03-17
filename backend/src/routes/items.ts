import * as express from 'express';
import * as itemsCtrl from '../controllers/items';
import {protect} from '../middlewares/auth';
import { validate } from '../utils/validate.middleware';
import { ItemSchema } from '../models/Items';
const router = express.Router();

router.get('/',protect, itemsCtrl.getAllItems);
router.post('/', protect, validate(ItemSchema), itemsCtrl.createItem);
router.put('/:id',protect, validate(ItemSchema), itemsCtrl.updateItem);
router.delete('/:id',protect, itemsCtrl.removeItem);

export default router;