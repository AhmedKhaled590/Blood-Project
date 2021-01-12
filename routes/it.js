var express = require('express');
var router = express.Router();
// DataBase
const { rows } = require('mssql');
var db = require('../DB/DatabaseConfig');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('pages/It', { title: "Blood Bank", css1: "reg", css2: "Preq", css3: "animate", scrp: "reg" })
});


/* post request . */
router.post('/',
  async (req, res) => {
    // -----------get the inputs ----------- // 
    const UserType = req.body.UserType;
    const SSN = req.body.SSN;
    const FirstName = req.body.FirstName;
    const Minit = req.body.Minit;
    const LastName = req.body.LastName;
    const email = req.body.email;
    const password = req.body.password;
    const ConfirmPassword = req.body.ConfirmPassword;
    const Gender = req.body.Gender;
    const PhoneNo = req.body.PhoneNo;
    const age = req.body.age;
    const Address = req.body.Address;
    // -----------------------------------   //
    var isMale
    if (Gender == 'Male')
      isMale = 1;
    else
      isMale = 0;
    if (SSN < 0 || PhoneNo < 0 || age < 0) return res.render('pages/it', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", msg: "Invalid Input!" });
    if (UserType == 'Doctor')
      var sql_query = `  INSERT INTO DOCTOR (SSN,Fname,Minit,Lname,Address,Age,Phone_Num, Email ,pass_word ,
          Gender,logged ,Notification) VALUES ('${SSN}' ,'${FirstName}','${Minit}','${LastName}' ,
           '${Address}','${age}' ,'${PhoneNo}' , '${email}', '${password}' ,'${isMale}',0 , 'No  Notification ' ); `
    else
      var sql_query = ` INSERT INTO EMPLOYEE (SSN,Fname,Minit,Lname,Address,Age,Phone_Num, Email ,pass_word ,
          Gender,logged ) VALUES ('${SSN}' ,'${FirstName}','${Minit}','${LastName}' ,
           '${Address}','${age}' ,'${PhoneNo}' , '${email}', '${password}' ,'${isMale}',1 ); `
    // ---------------------------------- //  

    db.all(sql_query,
      (err) => {
        if (err) {
          res.render('pages/It', { title: "Blood Bank", css1: "reg", css2: "Preq", css3: "animate", scrp: "reg" })
          return console.log(err);
        }
        else
          res.render('pages/Admin_MAIN', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: "" });
      })

  });
module.exports = router;
