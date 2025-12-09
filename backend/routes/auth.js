const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');
const protect = require('../middlewares/auth');

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/me',protect, authCtrl.authMe);

module.exports = router;