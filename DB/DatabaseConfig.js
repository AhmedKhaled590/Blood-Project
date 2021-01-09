const sqlite3 = require('sqlite3').verbose();
let db =new sqlite3.Database('DB/BloodDB.db',sqlite3.OPEN_READWRITE,err=>{
    if(err)
    {
        console.log(err);
    }
    else
{
        console.log("Connected!");
    }
});

module.exports = db;
