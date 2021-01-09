  
var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');

var User

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg" })
});

router.post('/', function (req, res, next) {
  if (req.body.UserType === "Donor") {
    var ssn = req.body.SSN;
    var firstName = req.body.FirstName;
    var Minit = req.body.Minit;
    var lastName = req.body.LastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var bloodGroup = req.body.BloodGroup;
    var gender = req.body.Gender;
    var weight = req.body.Weight;
    var num = req.body.PhoneNo;
    var age = req.body.age;
    var gov = req.body.Gov;
    var address = req.body.Address;
    // lazem te3mel select 3al SSN l awal w lw rege3lek msh fady show message eno meta5ed
    db.all(`INSERT INTO DONOR(SSN,Fname,Minit,Lname,Age,Address,Phone_Num,Email,pass_word,Gender,Blood_Type,Logged)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,1)`,
      [ssn, firstName, Minit, lastName, age, address, num, email, password, gender, bloodGroup],
      (err) => {
        if (err) return console.log(err);
        res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: firstName + " " + lastName })
      })
  }
  else if (req.body.UserType === "Recipient") {
    var ssn = req.body.SSN;
    var firstName = req.body.FirstName;
    var Minit = req.body.Minit;
    var lastName = req.body.LastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var bloodGroup = req.body.BloodGroup;
    var gender = req.body.Gender;
    var weight = req.body.Weight;
    var num = req.body.PhoneNo;
    var age = req.body.age;
    var gov = req.body.Gov;
    var address = req.body.Address;
    // const {SSN, FirstName} = req.body;
    db.all(`INSERT INTO PATIENT(SSN,Fname,Minit,Lname,Age,Address,Phone_Num,Email,pass_word,Gender,Blood_Type,Logged)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,1)`,
    [ssn, firstName, Minit, lastName, age, address, num, email, password, gender, bloodGroup],
    (err) => {
      if (err) return console.log(err);
        res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: firstName + " " + lastName })
      })
  }
  else if(req.body.UserType === "Organization"){
    console.log("wselt");
    const {OrganizationName,email,password,PhoneNo,Gov,Address}=req.body;
    db.all(`INSERT INTO ORGANIZATIONS(O_name,Email,Pass_word,Phone_Num,Location,logged)
            VALUES(?,?,?,?,?,1)`,[OrganizationName,email,password,PhoneNo,Gov+''+Address],
            (err)=>{
              if(err) return console.log(err);
              res.render('pages/Home',{ title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: OrganizationName })
            })
  }
});
module.exports = router;
