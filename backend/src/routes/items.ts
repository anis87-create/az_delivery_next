import * as express from 'express';
import * as itemsCtrl from '../controllers/items';
const router = express.Router();

router.get('/', itemsCtrl.getAllItems);
router.post('/',itemsCtrl.createItem);
router.put('/:id', itemsCtrl.updateItem);
router.delete('/:id', itemsCtrl.removeItem);

export default router;