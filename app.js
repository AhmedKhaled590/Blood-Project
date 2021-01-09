var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var RegRouter = require('./routes/Register');
var adminRouter = require('./routes/Admin');
var donateRouter = require('./routes/Donate');
var HomeRouter = require('./routes/Home');
var HReqRouter = require('./routes/HReq');
var PReqRouter = require('./routes/PReq');
var MainRouter = require('./routes/Main');
var NotifRouter = require('./routes/Notif');
var DoctorRouter = require('./routes/DoctorsTests');
var ItRouter = require('./routes/It');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Register', RegRouter);
app.use('/Admin', adminRouter);
app.use('/Donate', donateRouter);
app.use('/Home', HomeRouter);
app.use('/HReq', HReqRouter);
app.use('/Login', loginRouter);
app.use('/PReq', PReqRouter);
app.use('/Notif', NotifRouter);
app.use('/', MainRouter);
app.use('/DoctorTests', DoctorRouter);
app.use('/It', ItRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});




// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: "Blood Bank", css1: "reg", css2: "", css3: "", scrp: "reg" });
});

module.exports = app;
