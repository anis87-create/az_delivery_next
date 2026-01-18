import * as express from 'express';
import * as categoryCtrl from '../controllers/category';
import protect from '../middlewares/auth';
const router = express.Router();

router.get('/',protect, categoryCtrl.getAllCategories);
router.post('/',protect, categoryCtrl.createCategory);
router.put('/:id', protect, categoryCtrl.updateCategory);
router.delete('/:id',protect, categoryCtrl.removeCategory);

export default router;