  
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
    //if(typeof num!='number') return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Enter a valid Phone number!" })
    //if(typeof ssn!='number') return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Enter a valid SSN!" })
    if(confirmPassword!=password) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Passwords do not match!" })
    if(ssn<10000000000000)return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid SSN!" })
    if(weight<0) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid Weight!" })
    if(num<0||num<01000000000) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid Phone Number!" })
    db.all(`INSERT INTO DONOR(SSN,Fname,Minit,Lname,Age,Address,Phone_Num,Email,pass_word,Gender,Blood_Type,Logged,Notification)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,1,'No Notifiction')`,
      [ssn, firstName, Minit, lastName, age, address, num, email, password, gender, bloodGroup],
      (err) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
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
    //if(typeof num!='number') return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Enter a valid Phone number!" })
    //if(typeof ssn!='number') return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Enter a valid SSN!" })
    if(confirmPassword!=password) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Passwords do not match!" })
    if(confirmPassword!=password) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Passwords do not match!" })
    if(ssn<10000000000000)return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid SSN!" })
    if(weight<0) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid Weight!" })
    if(num<0||num<01000000000) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid Phone Number!" })
    if(age<16)return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Age must be greater than 16!" })

    db.all(`INSERT INTO PATIENT(SSN,Fname,Minit,Lname,Age,Address,Phone_Num,Email,pass_word,Gender,Blood_Type,Logged,Notification)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,1,'No Notification')`,
    [ssn, firstName, Minit, lastName, age, address, num, email, password, gender, bloodGroup],
    (err) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: firstName + " " + lastName })
      })
  }
  else if(req.body.UserType === "Organization"){
    console.log("wselt");
    const {OrganizationName,email,password,PhoneNo,Gov,Address}=req.body;
    var pass=req.body.pass;
    var number=req.body.PhoneNo
    var confirmPassword = req.body.confirmPassword;
    //if(typeof number!='number') return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Enter a valid Phone number!" })
    if(confirmPassword!=pass) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Passwords do not match!" })
    if(num<0||num<01000000000) return res.render('pages/Register', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg",msg:"Invalid Phone Number!" })
    db.all(`INSERT INTO ORGANIZATIONS(O_name,Email,Pass_word,Phone_Num,Location,logged,Notification)
            VALUES(?,?,?,?,?,1,'No  Notification')`,[OrganizationName,email,password,PhoneNo,Gov+''+Address],
            (err)=>{
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
              res.render('pages/Home',{ title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: OrganizationName })
            })
  }
});
module.exports = router;
