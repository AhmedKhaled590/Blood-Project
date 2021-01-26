var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');
var alert = require('alert');
/* GET users listing. */

var test;
var User;
db.each('SELECT fname,lname FROM DOCTOR where logged =1', function (err, user) {
  User = user;
});
router.get('/', function (req, res, next) {
  db.each('SELECT fname,lname FROM DOCTOR where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
    db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSN where TEST_RESULT="QUEUED"', (err, rows) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
      res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: user.Fname + " " + user.Lname })
    });
  });
});

router.post('/', function (req, res, next) {
  let id = req.body.OrderIdTest
  let result = req.body.Res
  db.each('SELECT fname,lname FROM DOCTOR where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
    db.all("Select TEST_RESULT from DONATION_REQUESTS WHERE ID = ?", [id], (err, r) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
      db.all('SELECT * FROM Donation_Requests where TEST_RESULT="QUEUED" and ID=?', [id], (err, rows) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
        if (rows == undefined) {
          alert('no request with this id');
          db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSN where TEST_RESULT="QUEUED"', (err, rows) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
            res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: user.Fname+" "+user.Lname })
          });
        }
        else if (r[0].TEST_RESULT == "QUEUED") {
          db.all(`UPDATE Donation_Requests  SET TEST_RESULT=? WHERE ID=?`, [result, id], (err) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
          });
          alert('Request Updated Successfully');
          db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSn where TEST_RESULT="QUEUED"', (err, rows) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
            res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: user.Fname+" "+user.Lname });
          });
        }
        else {
          alert('no request with this id is Queued');
          db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSN where TEST_RESULT="QUEUED"', (err, rows) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message });
            res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: user.Fname+" "+user.Lname })
          });
        }
      });
    });
  });
});

module.exports = router;
