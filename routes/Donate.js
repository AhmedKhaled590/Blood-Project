var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');
var alert = require('alert');
/* GET users listing. */
router.get('/', function (req, res, next) {
  db.each('SELECT fname,lname FROM Donor where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
    return res.render('pages/Donate', { title: "Blood Bank", css1: "reg", css2: "Preq", css3: "animate", scrp: "reg", UserName: user.Fname + " " + user.Lname })
  });
});
router.post('/', function (req, res, next) {
  let ssn;
  let request;
  let weight = req.body.weight;
  let date = req.body.dentistDate;
  let ndate = req.body.lastDate;
  let candonat = 1;

  db.each('SELECT * FROM donor where logged =1', function (err, user) {
    db.all(`SELECT * FROM Donation_Requests r,donor d where added!=-1 and test_result!="REJECTED" and r.ssn=? limit 1 `, [user.SSN], (err, row) => {
      request = row;
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      if (row[0] != undefined) {
        if (row[0].SSN === user.SSN) {
          return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You Already Have A Donation Request" })
        }
      }
      else {
        db.each('SELECT * FROM donor where logged =1', function (err, user) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
          db.all(`INSERT INTO Donation_Requests (SSN,Weight,DETERMINED_DATE,DDate,LDate,TEST_RESULT,ADDED) values(?,?,"",?,?,"QUEUED",0)`, [user.SSN, weight, date, ndate], (err) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
            return res.redirect('/TestRes_DON');
          });
        })
      }
    })
  })
})
module.exports = router;
