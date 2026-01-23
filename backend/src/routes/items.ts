import * as express from 'express';
import * as itemsCtrl from '../controllers/items';
import protect from '../middlewares/auth';
const router = express.Router();

router.get('/',protect, itemsCtrl.getAllItems);
router.post('/', protect, itemsCtrl.createItem);
router.put('/:id',protect, itemsCtrl.updateItem);
router.delete('/:id',protect, itemsCtrl.removeItem);

export default router;