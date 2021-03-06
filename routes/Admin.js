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
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    User = user;
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    if (User != undefined) {
      res.render('pages/Admin_MAIN', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "animate", scrp: "home", UserName: User.Fname + " " + User.Lname });
    }
    else {
      res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You Don't have access to  this page" })
    }
  });


});


var tot;
router.get('/Don', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    User = user;
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    if (User == undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You don't have access to this page" })
    db.all('SELECT *from Donation_requests R,DONOR D WHERE D.SSN = R.SSN AND (r.test_result!="REJECTED" or r.test_result!="FINISHED") ', function (err, rows) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      db.all('SELECT COUNT(*) AS n FROM DONATION_REQUESTS r where (r.test_result!="REJECTED" or r.test_result!="FINISHED") ', [], (err, t) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
        
        t.forEach(r => {
          tot = r;
          res.render('pages/Admin_DON', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname + " " + User.Lname, total: tot })
        })
      });
    });
  });
});


var sample;
var bestDonor;
var NumberOfDonations;
router.get('/DonRecords', function (req, res, next) {

  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    User = user;
  });

  db.all('SELECT blood_type, COUNT(*) as n FROM DON_RECORD R,DONOR D WHERE R.SSN=D.SSN group by blood_type', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    sample = rows;
  });

  db.all('select fname,d.ssn,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname ORDER by n DESC limit 1', (err, dn) => {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    dn.forEach(don => {
      bestDonor = don;
    })
  });


  db.all('SELECT * FROM DON_RECORD R ,DONOR D,num v WHERE D.SSN=R.SSN and r.ssn = v.ssn ', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    db.all('SELECT COUNT(*) as n FROM DON_RECORD', function (err, num) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
      res.render('pages/Admin_DONRecords', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, numdon: num[0].n, samples: sample, donor: bestDonor })
    });
  });
});
//-------------------------------------------------------------------------------------------


router.post('/DonRecords', function (req, res, next) {

  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    User = user;
  });


  let id = req.body.RequestId;
  console.log(id);
  let requests;
  let SSND;
  let date;
  db.all('SELECT * FROM Donation_Requests where ID=? and TEST_RESULT="CONFIRMED" and ADDED!=1', [id], (err, rows) => {
    if (err) throw err;
    console.log(rows);
    if (rows[0] == undefined) {
      // alert('no request with this id');
      //-----------------------------------------------
      db.all('SELECT COUNT(*) as n FROM DON_RECORD', function (err, num) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})

        num.forEach(nd => {
          // console.log(nd.n);
          NumberOfDonations = nd.n;
        })
      })
      db.all('SELECT blood_type, COUNT(*) as n FROM DON_RECORD R,DONOR D WHERE R.SSN=D.SSN group by blood_type', function (err, rows) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        sample = rows;
      });


      db.all('select fname,d.ssn,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname ORDER by n DESC limit 1', (err, dn) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        dn.forEach(don => {
          bestDonor = don;
        })
      });

      db.all('SELECT * FROM DON_RECORD R ,DONOR D,num v WHERE D.SSN=R.SSN and r.ssn = v.ssn ', function (err, rows) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        dona = rows;
        return res.render('pages/Admin_DONRecords', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, numdon: NumberOfDonations, samples: sample, donor: bestDonor })
      });
      //---------------------------------------------

    }
    else {
      console.log('1');
      SSND = rows[0].SSN;
      console.log('2')
      date = rows[0].DETERMINED_DATE
      console.log('3')
      if (date == undefined) {
        anpmlert('an appointment is not yet set for this request');
        //-------------------------------------------------------------------
        db.all('SELECT COUNT(*) as n FROM DON_RECORD', function (err, num) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          num.forEach(nd => {
            // console.log(nd.n);
            NumberOfDonations = nd.n;
          })
        })
        db.all('SELECT blood_type, COUNT(*) as n FROM DON_RECORD R,DONOR D WHERE R.SSN=D.SSN group by blood_type', function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          sample = rows;
        });


        db.all('select fname,d.ssn,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname ORDER by n DESC limit 1', (err, dn) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          dn.forEach(don => {
            bestDonor = don;
          })
        });

        db.all('SELECT * FROM DON_RECORD R ,DONOR D,num v WHERE D.SSN=R.SSN and r.ssn = v.ssn ', function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          dona = rows;
          return res.render('pages/Admin_DONRecords', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, numdon: NumberOfDonations, samples: sample, donor: bestDonor })
        });
        //-------------------------------------------------------------------
      }
      db.all('insert into DON_RECORD (SSN,DONATION_DATE,Request_ID) values(?,?,?)', [SSND, date, id], (err) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        // alert('sample inserted  successfully');
        //-----------------------------------------------------------------------------------------------------
        db.all(`UPDATE Donation_Requests SET ADDED=1 WHERE ID=?`, [id], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        });
        db.all('SELECT COUNT(*) as n FROM DON_RECORD', function (err, num) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          num.forEach(nd => {
            // console.log(nd.n);
            NumberOfDonations = nd.n;
          })
        })
        db.all('SELECT blood_type, COUNT(*) as n FROM DON_RECORD R,DONOR D WHERE R.SSN=D.SSN group by blood_type', function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          sample = rows;
        });


        db.all('select fname,d.ssn,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname ORDER by n DESC limit 1', (err, dn) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          dn.forEach(don => {
            bestDonor = don;
          })
        });

        db.all('SELECT * FROM DON_RECORD R ,DONOR D,num v WHERE D.SSN=R.SSN and r.ssn = v.ssn ', function (err, rows) {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          dona = rows;
          return res.render('pages/Admin_DONRecords', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", Donations: rows, UserName: User.Fname, numdon: NumberOfDonations, samples: sample, donor: bestDonor })
        });
        //----------------------------------------------------------------------------------------------------
      })
    }
  });
});




//-----------------------------------------------------------------------------
router.get('/Tests', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    User = user;
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })    
    if(User==undefined)return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You don't have access to this page" })
    db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result FROM DONOR D,Donation_requests q  WHERE q.ssn=d.ssn anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', [], function (err, rows) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })
      db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result FROM DONOR D,Donation_requests q  WHERE q.ssn=d.ssn anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', (err, ssns) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })    
        res.render('pages/TestRes', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", UserName: User.Fname, res: rows, ssn: ssns })
      });
    });
  });
});



router.post('/Tests', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message })    
    if(User==undefined)return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "You don't have access to this page" })
    var SSN = req.body.SSN;
    var Don_date = req.body.DONDATE;
    db.all(' UPDATE DONOR SET Notification = "Your Donation date is Set" WHERE SSN  = ? ', [SSN], (er) => {
      if (er) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: er.message})
      db.all('update Donation_requests set DETERMINED_DATE = ? WHERE SSN = ?', [Don_date, SSN], function (err) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        else {
          db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result FROM DONOR D,Donation_requests q  WHERE q.ssn=d.ssn anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', [], function (err, rows) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            db.all('SELECT d.ssn,d.fname,d.blood_type,q.test_result FROM DONOR D,Donation_requests q  WHERE q.ssn=d.ssn anD q.test_result="CONFIRMED" and q.DETERMINED_DATE==""', (err, ssns) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              res.render('pages/TestRes', { title: "Blood Bank", css1: "home", css2: "style", css3: "animate", scrp: "home", UserName: User.Fname, res: rows, ssn: ssns })
            });
          });
        }
      });
    });
  })
});



router.get('/Orders', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    User = user;
    db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
      db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname })
      })
    })
  });
});
router.post('/Orders', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    User = user;
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
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is NOT available Now in Inventory" })
              })
            })
          }
        })
      })

    }

    else if (orderIdOrg != undefined) {
      db.all("SELECT * FROM Org_Order WHERE ORDER_ID = ?", [orderIdOrg], (err, requ) => {
        if (err || requ[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        db.all("select count(Blood_Type) as avail from inventory where BLOOD_TYPE=?", [requ[0].Blood_Type], (err, s) => {
          if (err || s[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
          if (s[0].avail >= requ[0].Req_Amount) {
            db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is in Inventory" })
              })
            })
          }
          else {
            db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, orgz: org, UserName: User.Fname + " " + User.Lname, msg: "Required Order is NOT available Now in Inventory" })
              })
            })
          }
        })
      })
    }

    else if (orderIdResOrd != undefined) {
      db.all("SELECT * FROM PATIENT_ORDER WHERE ORDER_ID = ?", [orderIdResOrd], (err, requ) => {
        if (err || requ[0] === undefined) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        db.all("DELETE FROM INVENTORY WHERE Blood_Type= ? AND Sample_ID IN (SELECT Sample_ID FROM INVENTORY WHERE Blood_Type= ? limit ?)", [requ[0].Blood_Type, requ[0].Blood_Type, requ[0].Req_Amount], (err) => {
          db.all("DELETE FROM PATIENT_ORDER WHERE ORDER_ID = ? ", [orderIdResOrd], (err) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", pateint: pat, UserName: User.Fname + " " + User.Lname, orgz: org })
              })
            })
          })
        })
      })
    }

    else if (orderIdResOrg != undefined) {
      db.all("SELECT * FROM Org_order WHERE ORDER_ID = ?", [orderIdResOrg], (err, requ) => {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
        db.all("DELETE FROM INVENTORY WHERE Blood_Type= ? AND Sample_ID IN (SELECT Sample_ID FROM INVENTORY WHERE Blood_Type= ? limit ?)", [requ[0].Blood_Type, requ[0].Blood_Type, requ[0].Req_Amount], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          db.all("DELETE FROM org_order WHERE ORDER_ID = ? ", [orderIdResOrg], (err) => {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            db.all("select*from Patient_order O,PATIENT P WHERE P.SSN=O.PATIENT_ID", (err, pat) => {
              if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
              db.all("select*from org_order R,ORGANIZATIONS O WHERE R.ORG_ID=O.O_ID", (err, org) => {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Orders', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "home", UserName: User.Fname + " " + User.Lname, pateint: pat, orgz: org })
              })
            })
          })
        })
      })
    }
  });
});




router.get('/Inventory', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    User = user;
  });

  var sql = 'SELECT*FROM INVENTORY I,DON_RECORD R ,DONOR D WHERE I.Sample_ID=R.Sample_ID AND R.SSN=D.SSN ';

  var NumberOfDonations;
  db.all('SELECT COUNT(*) as n FROM INVENTORY', function (err, num) {

    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})

    num.forEach(nd => {
      NumberOfDonations = nd.n;
    })
  })

  db.all('SELECT r.blood_type, COUNT(*) as n FROM INVENTORY R group by r.blood_type  ', function (err, rows) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    db.all('select fname,d.ssn,dn.phone_num,dn.lname,count(*) as n from inventory i ,DON_RECORD d,donor dn WHERE i.Sample_ID=d.Sample_ID and d.ssn=dn.ssn GROUP by d.ssn,dn.fname,dn.phone_num,dn.lname ORDER by n DESC limit 3', (err, dn) => {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
      db.all(sql, [], function (err, inv) {
        if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Not Found" })
        res.render('pages/Inventory', { title: "Blood Bank", css1: "home", css2: "style", css3: "", scrp: "Inventory", Inventory: inv, numdon: NumberOfDonations, samples: rows, donors: dn, UserName: User.Fname })
      })
    });
  });
});


router.get('/Branches', function (req, res, next) {
  var User;
  db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {

    User = user;
  });
  db.all('SELECT*FROM BRANCH', [], function (err, branches) {
    if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
    res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches, UserName: "" })
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

    var User;
    db.each('SELECT fname,lname FROM EMPLOYEE where logged =1', function (err, user) {
      if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
      User = user;
    });


    if (Location != undefined && PhoneNum != undefined) {
      if (isLetter(Location)) {
        if (isPhoneNum(PhoneNum)) {
          db.all('Insert Into Branch (Location,Phone_Num) values (?,?)', [Location, PhoneNum], function (err) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            else {
              db.all('SELECT*FROM BRANCH', [], function (err, branches) {
                if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
                res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches, UserName: User.Fname })
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
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches, UserName: User.Fname })
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
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          res.render('pages/Employees', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", UserName: User.Fname, Emps: rows, h: 'Employees' })
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Number" })
      }
    }


    else if (SSNEmp != undefined) {
      if (isNum(SSNEmp) && isNum(Salary) && Salary > 0) {
        db.all('UPDATE EMPLOYEE SET SALARY = ? WHERE SSN = ?', [Salary, SSNEmp], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branches, UserName: User.Fname })
          });
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A  Positive Number" })

      }
    }
    else if (SSNDR != undefined) {
      if (isNum(SalaryDR) && isNum(SSNDR) && SalaryDR > 0) {
        db.all('UPDATE Doctor SET SALARY = ? WHERE SSN = ?', [SalaryDR, SSNDR], (err) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          db.all('SELECT*FROM BRANCH', [], function (err, branches) {
            if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
            res.render('pages/Branches', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", Branch: branche, UserName: User.Fnames })
          });
        })
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A  Positive  Number" })

      }
    }
    else if (BranchIDDr != undefined) {
      if (isNum(BranchIDDr)) {
        db.all('Select*from Doctor Where Branch_ID = ?', [BranchIDDr], (err, rows) => {
          if (err) return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: err.message})
          res.render('pages/Employees', { title: "Blood Bank", css1: "home", css2: "Preq", css3: "reg", scrp: "home", UserName: User.Fname, Emps: rows, h: 'Doctors' })
        });
      }
      else {
        return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Must Be A Positive Number" })
      }
    }
    else {
      return res.render("error", { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg", message: "Invalid Input" })

    }
  });



module.exports = router;
