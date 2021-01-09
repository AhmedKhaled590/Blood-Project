var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/Main',{title:"Blood Bank",css1:"main",css2:"",css3:"",scrp:""});
});


module.exports = router;