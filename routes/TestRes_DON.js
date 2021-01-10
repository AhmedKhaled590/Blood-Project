var express = require('express');
var router = express.Router();
// database
const { rows } = require('mssql');
var db = require('../DB/DatabaseConfig');



/* GET users listing. */
router.get('/', function(req, res, next) {
  
  var sql_query=`select ID, Fname ,Lname , Blood_Type,TEST_RESULT 
  from  DONOR ,Donation_Requests
  where DONOR.SSN = Donation_Requests.SSN and logged =1
  `;
  db.all(sql_query, [], (err, rows) => { 
    if (err) 
    {
      console.log(err);   // if erroe go to home 
      res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home" })
    }
    else 
    { 
        // if done display them
      res.render('pages/TestRes_DON',{title:"Blood Bank",css1:"home",css2:"Preq",css3:"animate",scrp:"home" , data:rows})
    } 
  })
  return ;
});

module.exports = router;
