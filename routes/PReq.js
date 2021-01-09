var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pages/PReq',{title:"Blood Bank",css1:"reg",css2:"Preq",css3:"animate",scrp:"reg"})
});

module.exports = router;
