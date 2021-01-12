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
  db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSN where TEST_RESULT="QUEUED"', (err, rows) => {
    console.log(rows);
    res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: "" })
  });
});

router.post('/', function (req, res, next) {
  let id = req.body.OrderIdTest
  let result = req.body.Res
  db.all('SELECT * FROM Donation_Requests where TEST_RESULT="QUEUED" and ID=?', [id], (err, rows) => {
    if (err) throw err;
    console.log(rows);
    if (rows == undefined) {
      alert('no request with this id');
      db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSN where TEST_RESULT="QUEUED"', (err, rows) => {
        console.log(rows);
        res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: "" })
      });
    }
    else {
      db.all(`UPDATE Donation_Requests  SET TEST_RESULT=? WHERE ID=?`, [result, id], (err) => {
        if (err) throw err;
      });
      alert('Request Updated Successfully');
      db.all('SELECT ID,Weight,DDate,LDate,Age from Donation_Requests R join Donor D on R.SSN=D.SSn where TEST_RESULT="QUEUED"', (err, rows) => {
        console.log(rows);
        res.render('pages/Doctors_Test', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Requests: rows, UserName: "" });
      });
    }
  });
});

module.exports = router;
