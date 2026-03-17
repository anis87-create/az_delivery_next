import * as express from 'express';
import * as categoryCtrl from '../controllers/category';
import {protect} from '../middlewares/auth';
import { optionalProtect } from '../middlewares/auth';
import { validate } from '../utils/validate.middleware';
import { categorySchema } from '../models/Category';
const router = express.Router();

router.get('/',optionalProtect, categoryCtrl.getAllCategories);
router.post('/',protect, validate(categorySchema), categoryCtrl.createCategory);
router.put('/:id', protect, validate(categorySchema), categoryCtrl.updateCategory);
router.delete('/:id',protect, categoryCtrl.removeCategory);

export default router;