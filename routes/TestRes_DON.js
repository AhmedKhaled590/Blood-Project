var express = require('express');
var router = express.Router();
// database
const { rows } = require('mssql');
var db = require('../DB/DatabaseConfig');



var User;
db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
  User = user;
});
/* GET users listing. */
router.get('/', function (req, res, next) {

  var sql_query = `select ID, Fname ,Lname , Blood_Type,TEST_RESULT 
  from  DONOR ,Donation_Requests
  where DONOR.SSN = Donation_Requests.SSN and logged =1 and added!=1
  `;
  db.all(sql_query, [], (err, rows) => {
    if (err) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
    }
    else {
      db.each("select fname,lname from donor where logged = 1", (err, u) => {
        res.render('pages/TestRes_DON', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", data: rows, UserName: u.Fname+" "+u.Lname })
      })
    }
  })
  return;
});

module.exports = router;
