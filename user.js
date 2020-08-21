var express = require('express');
var router = express.Router();

//router.use für middleware, die nur in dem Router benutzt wird
router.use('/user',express.static(__dirname+"/src/html/user"));
module.exports = router;