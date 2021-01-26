var express = require('express');
var router = express.Router();
// database
var db = require('../DB/DatabaseConfig');




/* GET users listing. */
router.get('/', function (req, res, next) {

  var sql_query = `select ID, Fname ,Lname , Blood_Type,TEST_RESULT 
  from  DONOR ,Donation_Requests
  where DONOR.SSN = Donation_Requests.SSN and logged =1 and added!=1
  `;
  db.all(sql_query, [], (err, rows) => {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
    else {
      db.all("select fname,lname from donor where logged = 1", (err, u) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
        if(u[0]===undefined)return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You must Login First As A donor" })
        return res.render('pages/TestRes_DON', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", data: rows, UserName: u[0].Fname + " " + u[0].Lname })
      })
    }
  })
});

module.exports = router;
