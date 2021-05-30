require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const moment = require('moment');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const statuses = {
  'Αναμονή ελέγχου': 'Η κατάσταση της επισκευής σας άλλαξε σε ΑΝΑΜΟΝΗ ΕΛΕΓΧΟΥ. \
    <br>Your RMA status has changed to AWAITING DIAGNOSIS.',
  'Ελεγχος σε εξέλιξη': 'Η κατάσταση της επισκευής σας άλλαξε σε ΕΛΕΓΧΟΣ ΣΕ ΕΞΕΛΙΞΗ. \
   <br>Your RMA status has changed to DIAGNOSIS IN PROGRESS.',
  'Ελεγχος διαθεσιμότητας ανταλλακτικού': 'Η κατάσταση της επισκευής σας άλλαξε σε \
    ΕΛΕΓΧΟΣ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ ΑΝΤΑΛΛΑΚΤΙΚΟΥ. <br>Your RMA status has changed to CHECKING SPARE PART \
    AVAILABILITY.',
  'Αναμονή αποδοχής προσφοράς': 'Η κατάσταση της επισκευής σας άλλαξε σε ΑΝΑΜΟΝΗ ΑΠΟΔΟΧΗΣ \
    ΠΡΟΣΦΟΡΑΣ. <br>Your RMA status has changed to PENDING ACCEPTANCE OF COST PROPOSAL.',
  'Αναμονή ανταλλακτικού': 'Η κατάσταση της επισκευής σας άλλαξε σε ΑΝΑΜΟΝΗ ΑΝΤΑΛΛΑΚΤΙΚΟΥ. \
    <br>Your RMA status has changed to AWAITING SPARE PART.',
  'Αναμονή επισκευής': 'Η κατάσταση της επισκευής σας άλλαξε σε ΑΝΑΜΟΝΗ ΕΠΙΣΚΕΥΗΣ. \
    <br>Your RMA status has changed to AWAITING REPAIR.',
  'Επισκευή σε εξέλιξη': 'Η κατάσταση της επισκευής σας άλλαξε σε ΕΠΙΣΚΕΥΗ ΣΕ ΕΞΕΛΙΞΗ. \
    <br>Your RMA status has changed to REPAIR IN PROGRESS.',
  'Ολοκλήρωση επισκευής': 'Η κατάσταση της επισκευής σας άλλαξε σε ΟΛΟΚΛΗΡΩΣΗ ΕΠΙΣΚΕΥΗΣ. \
    <br>Your RMA status has changed to REPAIR COMPLETED.',
  'Παραλαβή - Αποστολή': 'Η κατάσταση της επισκευής σας άλλαξε σε ΠΑΡΑΛΑΒΗ - ΑΠΟΣΤΟΛΗ. \
    <br>Your RMA status has changed to PICKED UP – IN TRANSIT.'
}

function handleMessage(rowMessage) {
  let msgToCheck = rowMessage.split('To: ')[1];
  let thisMessage = '';
  for([status, message] of Object.entries(statuses)) {    
    if ( msgToCheck && msgToCheck.includes(status) ) { thisMessage = message; }
  }
  return thisMessage;
}

app.locals.displayRow = function(row) {
  let thisRow = '';
  let time = moment(row.date).format("DD-MM-YYYY hh:mm:ss");
  let message = handleMessage(row.details);
  if (message) {
    thisRow = `<tr><td>${time}</td><td>${message}</td></tr`;
  }
  return thisRow;
}

module.exports = app;