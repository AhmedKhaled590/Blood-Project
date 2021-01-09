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
    if (err) return console.log(err);
    console.log(row);
    var countApos, countAneg, countBpos, countBneg, countABpos, countABneg, countOpos, countOneg
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
    res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home",countApos,countAneg,countBpos,countBneg,countABpos,countABneg,countOpos,countOneg})  
  })
});

router.get('/Tests', function (req, res, next) {
  res.render('pages/TestRes_DON', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home" })
});

router.get('/ChangeAppointment', function (req, res, next) {
  res.render('pages/CHGAppointement', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home" })
});

module.exports = router;


