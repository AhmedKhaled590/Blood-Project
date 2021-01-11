var express = require('express');
const { rows } = require('mssql');
var router = express.Router();
var db = require('../DB/DatabaseConfig');

const { body, validationResult, check } = require('express-validator');
const e = require('express');



var User;
db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
  User = user;
});

router.get('/', function (req, res, next) {
  console.log(User);

  if (User != undefined) {
    res.render('pages/Admin_MAIN', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: User.Fname + " " + User.Lname });
  }
  else {
    res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You Don't have access to  this page" })
  }

});


var tot;
router.get('/Don', function (req, res, next) {
  db.all('SELECT *from Donation_requests R,DONOR D WHERE D.SSN = R.SSN AND (r.test_result!="REJECTED" or r.test_result!="FINISHED") ', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    db.all('SELECT COUNT(*) AS n FROM DONATION_REQUESTS r where r.test_result="QUEUED" ', [], (err, t) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      t.forEach(r => {
        tot = r;
        res.render('pages/Admin_DON', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, total: tot })
      })
    });
  });
});


var sample;
var bestDonor;
router.get('/DonRecords', function (req, res, next) {



  db.all('SELECT blood_type, COUNT(*) as n FROM DON_RECORD R,DONOR D WHERE R.SSN=D.SSN group by blood_type', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    sample = rows;
  });

  db.all('select fname,d.ssn,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname ORDER by n DESC limit 1', (err, dn) => {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    dn.forEach(don => {
      bestDonor = don;
    })
  });

  db.all('SELECT * FROM DON_RECORD R ,DONOR D,num v WHERE D.SSN=R.SSN and r.ssn = v.ssn ', function (err, rows) {
    db.all('SELECT COUNT(*) as n FROM DON_RECORD', function (err, num) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" });
      res.render('pages/Admin_DONRecords', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, numdon: num[0].n, samples: sample, donor: bestDonor })
    });
  });
});


router.get('/Tests', function (req, res, next) {
  db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result,dr.fname as drname FROM DONOR D,Donation_requests q ,DOCTORs_DONORS_CASES N,doctor dr WHERE q.ssn=d.ssn and D.SSN = N.SSN and dr.ssn = n.DOCTOR_SSN anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', [], function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })

    db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result,dr.fname as drname FROM DONOR D,Donation_requests q ,DOCTORs_DONORS_CASES N,doctor dr WHERE q.ssn=d.ssn and D.SSN = N.SSN and dr.ssn = n.DOCTOR_SSN anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', (err, ssns) => {
      console.log(ssns)
      res.render('pages/TestRes', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", UserName: User.Fname, res: rows, ssn: ssns })
    });
  });
});



router.post('/Tests', function (req, res, next) {
  console.log(req.body);
  var SSN = req.body.SSN;
  var Don_date = req.body.DONDATE;
  console.log(SSN);
  db.all(' UPDATE DONOR SET Notification = "Your Donation date is Set" WHERE SSN  = ? ', [SSN], (er) => {
    if (er) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    db.all('update Donation_requests set DETERMINED_DATE = ? WHERE SSN = ?', [Don_date, SSN], function (err) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      else {
        db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result,dr.fname as drname FROM DONOR D,Donation_requests q ,DOCTORs_DONORS_CASES N,doctor dr WHERE q.ssn=d.ssn and D.SSN = N.SSN and dr.ssn = n.DOCTOR_SSN and q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', [], function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result,dr.fname as drname FROM DONOR D,Donation_requests q ,DOCTORs_DONORS_CASES N,doctor dr WHERE q.ssn=d.ssn and D.SSN = N.SSN and dr.ssn = n.DOCTOR_SSN anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', (err, ssns) => {
            console.log(ssns)
            res.render('pages/TestRes', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", UserName: User.Fname, res: rows, ssn: ssns })
          });
        });
      }
    });
  })
});



router.get('/Orders', function (req, res, next) {
  db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname })
    })
  })
});
router.post('/Orders', function (req, res, next) {
  var orderIdOrd = req.body.OrderId;
  var orderIdResOrd = req.body.OrderIdRes;
  var orderIdOrg = req.body.OrderIdOrg;
  var orderIdResOrg = req.body.OrderIdResOrg;

  if (orderIdOrd != undefined) {
    db.all("SELECT * FROM PATIENT_ORDER WHERE ORDER_ID = ?", [orderIdOrd], (err, requ) => {
      if (err || requ[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      db.all("select count(Blood_Type) as avail from inventory where BLOOD_TYPE=?", [requ[0].Blood_Type], (err, s) => {
        if (err || s[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        if (s[0].avail >= requ[0].Req_Amount) {
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is in Inventory" })
            })
          })
        }
        else {
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is NOT available Now in Inventory" })
            })
          })
        }
      })
    })

  }

  else if (orderIdOrg != undefined) {
    db.all("SELECT * FROM Org_Order WHERE ORDER_ID = ?", [orderIdOrg], (err, requ) => {
      if (err|| requ[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      db.all("select count(Blood_Type) as avail from inventory where BLOOD_TYPE=?", [requ[0].Blood_Type], (err, s) => {
        if (err|| s[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        if (s[0].avail >= requ[0].Req_Amount) {
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is in Inventory" })
            })
          })
        }
        else {
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is NOT available Now in Inventory" })
            })
          })
        }
      })
    })
  }

  else if (orderIdResOrd != undefined) {
    db.all("SELECT * FROM PATIENT_ORDER WHERE ORDER_ID = ?", [orderIdResOrd], (err, requ) => {
      if (err|| requ[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      db.all("DELETE FROM INVENTORY WHERE Blood_Type= ? AND Sample_ID IN (SELECT Sample_ID FROM INVENTORY WHERE Blood_Type= ? limit ?)", [requ[0].Blood_Type, requ[0].Blood_Type, requ[0].Req_Amount], (err) => {
        if (err|| s[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        db.all("DELETE FROM PATIENT_ORDER WHERE ORDER_ID = ? ", [orderIdResOrd], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, UserName: User.Fname + " " + User.Lname, orgz: org })
            })
          })
        })
      })
    })
  }

  else if (orderIdResOrg != undefined) {
    db.all("SELECT * FROM Org_order WHERE ORDER_ID = ?", [orderIdResOrg], (err, requ) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
      db.all("DELETE FROM INVENTORY WHERE Blood_Type= ? AND Sample_ID IN (SELECT Sample_ID FROM INVENTORY WHERE Blood_Type= ? limit ?)", [requ[0].Blood_Type, requ[0].Blood_Type, requ[0].Req_Amount], (err) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        db.all("DELETE FROM org_order WHERE ORDER_ID = ? ", [orderIdResOrg], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
              res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", UserName: User.Fname + " " + User.Lname, pateint: pat, orgz: org })
            })
          })
        })
      })
    })
  }

});




router.get('/Inventory', function (req, res, next) {

  var sql = 'SELECT*FROM INVENTORY I,DON_RECORD R ,DONOR D WHERE I.Sample_ID=R.Sample_ID AND R.SSN=D.SSN ';

  var NumberOfDonations;
  db.all('SELECT COUNT(*) as n FROM INVENTORY', function (err, num) {

    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })

    num.forEach(nd => {
      NumberOfDonations = nd.n;
    })
  })

  db.all('SELECT r.blood_type, COUNT(*) as n FROM INVENTORY R group by r.blood_type  ', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    db.all('select fname,d.ssn,dn.phone_num,dn.lname,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname,dn.phone_num,dn.lname ORDER by n DESC limit 3', (err, dn) => {
      db.all(sql, [], function (err, inv) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        res.render('pages/Inventory', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "Inventory", Inventory: inv, numdon: NumberOfDonations, samples: rows, donors: dn, UserName: User.Fname + " " + User.Lname })
      })
    });
  });
});


router.get('/Branches', function (req, res, next) {
  db.all('SELECT*FROM BRANCH', [], function (err, branches) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
    res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches })
  })
});

function isLetter(str) {
  return (/[a-zA-Z]/).test(str)
}

function isNum(str) {
  return (/[0-9]/).test(str)
}

function isPhoneNum(str) {
  return str.length === 11 && (/[0-9]/).test(str);
}

router.post('/Branches',
  function (req, res, next) {
    var Location = req.body.Location;
    var PhoneNum = req.body.PhoneNum;
    var BranchID = req.body.BranchID;
    var BranchIDEmp = req.body.BranchIDEmp;
    var BranchIDDr = req.body.BranchIDDr;
    var SSNEmp = req.body.SSNEmployees;
    var Salary = req.body.SalaryEmployees;
    var SSNDR = req.body.SSNDoctors;
    var SalaryDR = req.body.SalaryDoctors;


    if (Location != undefined && PhoneNum != undefined) {
      if (isLetter(Location)) {
        if (isPhoneNum(PhoneNum)) {
          db.all('Insert Into Branch (Location,Phone_Num) values (?,?)', [Location, PhoneNum], function (err) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            else {
              db.all('SELECT*FROM BRANCH', [], function (err, branches) {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
                res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches })
              });
            }
          });
        }
        else {
          return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A 11 Numbers " })
        }
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A String" })
      }
    }

    else if (BranchID != undefined) {
      if (isNum(BranchID)) {
        db.all('delete FROM BRANCH where Branch_ID = ?', [BranchID], function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches })
          });
        });
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })

      }
    }


    else if (BranchIDEmp != undefined) {
      if (isNum(BranchIDEmp)) {
        db.all('Select*from Employee Where Branch_ID = ?', [BranchIDEmp], (err, rows) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          res.render('pages/Employees', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", UserName: User.Fname, Emps: rows, h: 'Employees' })
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })
      }
    }


    else if (SSNEmp != undefined) {
      if (isNum(SSNEmp) && isNum(Salary)) {
        db.all('UPDATE EMPLOYEE SET SALARY = ? WHERE SSN = ?', [Salary, SSNEmp], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches })
          });
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })

      }
    }
    else if (SSNDR != undefined) {
      if (isNum(SalaryDR) && isNum(SSNDR)) {
        db.all('UPDATE Doctor SET SALARY = ? WHERE SSN = ?', [SalaryDR, SSNDR], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches })
          });
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })

      }
    }
    else if (BranchIDDr != undefined) {
      if (isNum(BranchIDDr)) {
        db.all('Select*from Doctor Where Branch_ID = ?', [BranchIDDr], (err, rows) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          res.render('pages/Employees', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", UserName: User.Fname, Emps: rows, h: 'Doctors' })
        });
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })
      }
    }
  });



module.exports = router;
