var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');

//set looged =1

/ * GET users listing.  */
router.get('/', function (req, res, next) {
  res.render('pages/Login', { title: "Blood Bank", css1: "util", css2: "login", css3: "animate", scrp: "main" })
});

router.post('/', function (req, res, next) {
  const { username, pass } = req.body;
  if (!username || !pass) return res.send("Enter Email and Password!");
  if(req.body.UserType==="NULL") return res.send("Enter a user type!");
  let user;
  if (req.body.UserType === "Donor") {
    console.log(req.body.UserType);
    db.all(`SELECT * FROM DONOR WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if (err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE DONOR SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + " " + record.Lname });
        })
      }
      else return res.send("Enter a correct Email and Password!");
    })
  }
  else if (req.body.UserType === "Recipient") {
    console.log(req.body.UserType);
    db.all(`SELECT * FROM PATIENT WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if (err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE PATIENT SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + " " + record.Lname });
        })
      }
      else return res.send("Enter a correct Email and Password!");
    })
  }
  else if (req.body.UserType === "Organization") {
    console.log(req.body.UserType);
    db.all(`SELECT * FROM ORGANIZATIONS WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if (err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE ORGANIZATIONS SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.O_name });
        })
      }
      else return res.send("Enter a correct Email and Password!");
    })
  }
  else if (req.body.UserType === "Doctor") {
    console.log(req.body.UserType);
    db.all(`SELECT * FROM DOCTOR WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if (err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE DOCTOR SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + " " + record.Lname });
        })
      }
      else return res.send("Enter a correct Email and Password!");
    })
  }
  else if (req.body.UserType === "Employee") {
    console.log(req.body.UserType);
    db.all(`SELECT * FROM EMPLOYEE WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if (err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE EMPLOYEE SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + " " + record.Lname });
        })
      }
      else return res.send("Enter a correct Email and Password!");
    })
  }
})

/*router.post('/', function (req, res, next) {
  const { username, pass } = req.body;
  if (!username || !pass) return res.send("Enter Email and Password!");
  let user;
  db.all(`SELECT * FROM DONOR WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
    if(err) return console.log(err);
    user = row;
    console.log(user[0]);
    if (user[0] != undefined) {
      db.all(`UPDATE DONOR SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
      user.forEach(record => {
      res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + "" + record.Lname });
      })
    }
    console.log("here");
    db.all(`SELECT * FROM PATIENT WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
      if(err) return console.log(err);
      user = row;
      console.log(user[0]);
      if (user[0] != undefined) {
        db.all(`UPDATE PATIENT SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
        user.forEach(record => {
          res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.Fname + "" + record.Lname });
        })
      }
      db.all(`SELECT * FROM ORGANIZATIONS WHERE Email=? AND pass_word=?`, [username, pass], (err, row) => {
        if(err) return console.log(err);
        user = row;
        if (user[0] != undefined) {
          db.all(`UPDATE ORGANIZATIONS SET logged=1 WHERE Email=? AND pass_word=?`, [username, pass]);
          user.forEach(record => {
            res.render('pages/Home', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: record.O_name });
          })
        }
        else return res.send("Enter correct Email and Password!");
      })
    })
  })
})*/

module.exports = router;
