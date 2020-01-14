var express = require('express');
var router = express.Router();

router.use('/', require('./user'));
router.use('/account', require('./account/index'));


module.exports = router;
