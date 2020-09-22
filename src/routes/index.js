const express = require('express');
const router = express.Router();
const homeRouter = require('./home');



router.use('/', homeRouter);
router.use('/index.html', homeRouter);


module.exports = router;
