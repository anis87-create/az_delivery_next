import * as express from 'express';
import * as categoryCtrl from '../controllers/category';
const router = express.Router();

router.get('/', categoryCtrl.getAllCategories);
router.post('/',categoryCtrl.createCategory);
router.put('/:id', categoryCtrl.updateCategory);
router.delete('/:id', categoryCtrl.removeCategory);

export default router;