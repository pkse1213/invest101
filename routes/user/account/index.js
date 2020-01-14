var express = require('express');
var router = express.Router();

router.use('/', require('./account'));

module.exports = router;
