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
router.get('/', function(req, res, next) {
  
  var sql_query=`select ID, Fname ,Lname , Blood_Type,TEST_RESULT 
  from  DONOR ,Donation_Requests
  where DONOR.SSN = Donation_Requests.SSN and logged =1 and added!=1
  `;
  db.all(sql_query, [], (err, rows) => { 
    if (err) 
    {
      console.log(err);   // if erroe go to home 
      res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home",UserName:User.Fname })
    }
    else 
    { 
        // if done display them
      res.render('pages/TestRes_DON',{title:"Blood Bank",css1:"home",css2:"Preq",css3:"animate",scrp:"home" , data:rows,UserName:User.Fname})
    } 
  })
  return ;
});

module.exports = router;
