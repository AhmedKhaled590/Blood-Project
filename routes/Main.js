var express = require('express');
const db = require('../DB/DatabaseConfig');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  db.all("UPDATE DONOR SET LOGGED =0 ", (err) => {
    db.all("UPDATE PATIENT SET LOGGED = 0", (err) => {
      db.all("UPDATE EMPLOYEE SET LOGGED = 0", (err) => {
        db.all("UPDATE DOCTOR SET LOGGED = 0", (err) => {
          res.render('pages/Main', {title: "Blood Bank", css1: "main", css2: "", css3: "", scrp: ""
          })
        })
      })
    })
  })
});


module.exports = router;