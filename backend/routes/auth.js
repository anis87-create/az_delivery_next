const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');

router.get('/test', authCtrl.login);


module.exports = router;