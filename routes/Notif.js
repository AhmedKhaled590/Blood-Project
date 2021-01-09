var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif"})
});



module.exports = router;
