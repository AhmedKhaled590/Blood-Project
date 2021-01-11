var express = require('express');
var router = express.Router();
// database
const { rows } = require('mssql');
var db = require('../DB/DatabaseConfig');


router.get('/', function(req, res, next) {

  var doctor=`select  Notification,Fname,Lname from doctor where logged =1  `;
  var donor=`select  Notification,Fname,Lname from donor where logged =1  `;
  var org=`select  Notification,Fname,Lname from ORGANIZATIONS where logged =1  `;
  var patient=`select  Notification,Fname,Lname from PATIENT where logged =1  `;
  db.all(doctor, [], (err, rows) => {
    if (err ||rows[0] == undefined ) 
    {
      console.log(err) ;   // if error go to home 
      // res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home" })
    }
    else 
    {  
        // if done display them
        return res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif" , data:rows,UserName:rows[0].Fname+" "+rows[0].Lname})
    }
  })

  db.all(patient, [], (err, rows) => {
    if (err ||rows[0] == undefined) 
    {
      console.log(err);  
    }
    else 
    {  
        // if done display them
        return res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif" , data:rows,UserName:rows[0].Fname+" "+rows[0].Lname})
    }
  })
  db.all(org, [], (err, rows) => {
    if (err ||rows[0] == undefined) 
    {
      console.log(err); 
    }
    else 
    {  
        // if done display them
        return res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif" , data:rows,UserName:rows[0].Fname+" "+rows[0].Lname})
    }
  })

  db.all(donor, [], (err, rows) => {
    if (err ||rows[0] == undefined) 
    {
      console.log(err);  
      return res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif" , data:rows,UserName:rows[0].Fname+" "+rows[0].Lname})
    }
    else 
    {  
        // if done display them
        console.log(rows);
        return res.render('pages/Notif',{title:"Blood Bank",css1:"reg",css2:"notif",css3:"animate",scrp:"notif" , data:rows,UserName:rows[0].Fname+" "+rows[0].Lname})
    }
  })
});

module.exports = router;
