require('dotenv').config({ silent: true })
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");

mongoose.connect("mongodb://localhost/myappdatabase");
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});
app.use(methodOverride('_method'))

app.use('/user', require('./controllers/users_controller'))
app.use('/trips', require('./controllers/trips_controller'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});



app.listen(process.env.PORT || 3000)
