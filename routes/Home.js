var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');

//code to get today's date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;



/* GET users listing. */
router.get('/', function (req, res, next) {
  let query = `SELECT D.Blood_Type,COUNT(*) FROM DON_RECORD AS DR INNER JOIN DONOR AS D WHERE DR.SSN=D.SSN 
              AND DONATION_DATE=? GROUP BY Blood_Type ORDER BY Blood_Type ASC`;
  db.all(query, [today], (err, row) => {
    if (err) res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
    var countApos = undefined, countAneg = undefined, countBpos = undefined, countBneg = undefined, countABpos = undefined, countABneg = undefined, countOpos = undefined, countOneg = undefined
    if (row[0] != undefined) {
      row.forEach(record => {
        switch (record.Blood_Type) {
          case 'A+':
            countApos = record['COUNT(*)'];
            break;
          case 'A-':
            countAneg = record['COUNT(*)'];
            break;
          case 'B+':
            countBpos = record['COUNT(*)'];
            break;
          case 'B-':
            countBneg = record['COUNT(*)'];
            break;
          case 'AB+':
            countABpos = record['COUNT(*)'];
            break;
          case 'AB-':
            countABneg = record['COUNT(*)'];
            break;
          case 'O+':
            countOpos = record['COUNT(*)'];
            break;
          case 'O-':
            countOneg = record['COUNT(*)'];
            break;
        }
      })
    }
    db.all("select fname,lname from donor where logged = 1", (err, u) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      if (u[0] == undefined) {
        db.all("select fname,lname from patient where logged = 1", (err, u) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
          if (u[0] == undefined) {
            db.all("select fname,lname from organizations where logged = 1", (err, u) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
              if (u[0] == undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You must Login First" })
              res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", countApos, countAneg, countBpos, countBneg, countABpos, countABneg, countOpos, countOneg, UserName: u[0].Fname + " " + u[0].Lname })
            })
          }
          else {
            res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", countApos, countAneg, countBpos, countBneg, countABpos, countABneg, countOpos, countOneg, UserName: u[0].Fname + " " + u[0].Lname })
          }
        })
      }
      else {
        res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", countApos, countAneg, countBpos, countBneg, countABpos, countABneg, countOpos, countOneg, UserName: u[0].Fname + " " + u[0].Lname })
      }
    })
  })
});



router.get('/ChangeAppointment', function (req, res, next) {
  db.all('select*from donor where logged=1', (err, row) => {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
    if (row[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You must Login First as a donor" })
    db.all('select*from donation_requests where ssn = ?  and TEST_RESULT != "REJECTED"', [row[0].SSN], (err, records) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      res.render('pages/CHGAppointement', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", res: records[0], UserName: row[0].Fname + " " + row[0].Lname })
    })
  })
});



router.post('/ChangeAppointment', function (req, res, next) {
  if (req.body.cancel != undefined) {
    db.all('select*from donor where logged=1', (err, row) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      if (row[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You must Login First as a donor" })
      db.all('delete from donation_requests where ssn = ?  and TEST_RESULT != "REJECTED" ', [row[0].SSN], err => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
        res.render('pages/CHGAppointement', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: row[0].Fname + " " + row[0].Lname })
      })
    })
  }
  else {
    db.all('select*from donor where logged=1', (err, row) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      if (row[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You must Login First as a donor" })
      db.all(`UPDATE DONATION_REQUESTS SET DETERMINED_DATE = '' added=0 WHERE SSN = ?  and TEST_RESULT != "REJECTED"`, [row[0].SSN], (err) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
        db.all('select*from donation_requests where ssn = ?  and TEST_RESULT != "REJECTED"', [row[0].SSN], (err, records) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
          res.render('pages/CHGAppointement', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", res: records[0], UserName: row[0].Fname + " " + row[0].Lname })
        })
      })
    })
  }
});

module.exports = router;


