if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');

// Mongo Atlas connection:
const { MongoStore } = require('connect-mongo');
const MongoDBStore = require('connect-mongo');

// models;
const User = require('./models/UserModel');

// routes:
const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const stockRoutes = require('./routes/stockRoutes');

// express-session:
const session = require('express-session');

// flash
const flash = require('connect-flash');

//ejs-mate package to make use of additional ejs functionalities like layout, partials etc
const ejsMate = require('ejs-mate');

// passport for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

//method-override package so that we can make use of put and delete
const methodOverride = require('method-override');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sma';
console.log(dbUrl);
const mongoose = require('mongoose');
main()
  .then((res) => {})
  .catch((err) => {});
async function main() {
  await mongoose.connect(dbUrl);
}

// telling express that we will be using ejsMate instead of the default one
app.engine('ejs', ejsMate);

// Set EJS as templating engine
app.set('view engine', 'ejs');
/*
  __dirname represents the directory we are currently working in
  and views is the folder where all of our ejs templates will be kept
*/
app.set('views', path.join(__dirname, 'views'));

// to parse the data for post requests, or in other words:
// to access the data submited by a form to a post request
app.use(express.urlencoded({ extended: true }));

// query string value to override a method
app.use(methodOverride('_method'));

//for making use of custom css and js files in the public directory:
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.secret || 'thisshouldbeabettersecret';
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret,
  },
   // should be in seconds:
   touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
  console.log('Session store error: ', e);
});

// express-session settings
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// setting up flash:
app.use(flash());

// setting up passport:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash:
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROUTES:
app.use('/', userRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/stock', stockRoutes);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404));
});

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh No, something went wrong!';
  }
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000
app.listen(port, (req, res) => {
  console.log(`SMA active on port ${port}`);
});

// for testing
module.exports = app;
