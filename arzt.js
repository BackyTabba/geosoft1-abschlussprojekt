var express = require('express');
var router = express.Router();

router.use("/arzt",express.static(__dirname+"/src/html/arzt"));
module.exports = router;