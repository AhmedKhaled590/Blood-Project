var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');
var alert = require('alert');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pages/Donate',{title:"Blood Bank",css1:"reg",css2:"Preq",css3:"animate",scrp:"reg"})
});
router.post('/', function (req, res, next) {
  let ssn;
  let request;
  let weight=req.body.weight;
  let date=req.body.dentistDate;
  let ndate=req.body.lastDate;
  let candonat=1;
  db.all(`SELECT SSN FROM DONOR WHERE logged=1`, (err, row) => {
    if (err) 
    {
       console.log(err);
     return  res.render('pages/Donate',{title:"Blood Bank",css1:"reg",css2:"Preq",css3:"animate",scrp:"reg"})
    }
    console.log(row);
    ssn = row[0].SSN;
    console.log(ssn)
  })
   

  db.all(`SELECT * FROM Donation_Requests `, (err, row) => {
    request=row;
    console.log(request)
    if (err) 
    {
        console.log(err);
      // return  res.render('pages/',{title:"Blood Bank",css1:"reg",css2:"Preq",css3:"animate",scrp:"reg"})
      return res.redirect('/Home');  
  
    }
   row.forEach(elem=>{
     if(elem.SSN===ssn)
     {
       if(elem.TEST_RESULT!='REJECTED' && elem.ADDED!=1)
       {
       candonat=0;
       }
     }
   })
  
    if(candonat==0) 
    {
      alert("you already have a donation request");
      return  res.render('pages/Donate',{title:"Blood Bank",css1:"reg",css2:"Preq",css3:"animate",scrp:"reg"})
      }
    else
      {
        console.log(date,ndate);
          db.all(`INSERT INTO Donation_Requests (SSN,Weight,DDate,LDate,TEST_RESULT,ADDED) values(?,?,?,?,"QUEUED",0)`,[ssn,weight,date,ndate]);
        return res.redirect('/TestRes_DON');
    }     
    })
    
    

})
module.exports = router;
