# Putting it All Together

## Final Code Snippet

```javascript
/* eslint-disable no-shadow */
/*
  Date: 8-13-18
  Description: Main Entry Server for express_books example.
  Purpose: Create a Restful API with authentication using passport.js
*/

// appmetrics
require('appmetrics-dash').attach();

// express
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

// idb-pconnector
const { DBPool } = require('idb-pconnector');

const url = process.env.DATABASE || '*LOCAL';
const password = process.env.DBPASS || '';
const username = process.env.DBUSER || '';

const pool = new DBPool({ url, username, password }, { debug: true });

// view engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use('/assets', express.static(`${__dirname}/public`));

// authentication
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const flash = require('connect-flash');
const { hostname } = require('os');
const { ibmiAuth, generateSecret } = require('./utils.js');

const secret = process.env.SECRET || generateSecret();


// Register middleware
app.use(session({
  // Secret is unique key to sign the cookie should be random long sequence of chars.
  secret,
  resave: false,
  // if saveUninitialized is set to true
  // Cookie will be given to user even if is not logged in, make sure its false.
  saveUninitialized: false,
  // expires in 30 min. 30 min = 1800000 ms
  // cookie: {maxAge  : new Date(Date.now() + 1800000)}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// local strategy is called when passport.authenticate is called. Ex: post req for /login.
passport.use(new LocalStrategy(
  ((username, password, done) => {
    ibmiAuth(username, password, (err, result) => {
      if (result) {
        return done(null, username);
      }
      return done(null, false, 'Invalid username or password');
    });
  }),
));

passport.serializeUser((username, done) => {
  done(null, username);
});

passport.deserializeUser((username, done) => {
  done(null, username);
});

// used by routes needing to authenticate
exports.passport = passport;
// Used by routes for db2 access
exports.pool = pool;

// middleware function so that views can check if authenticated with locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Register Routers
const indexRouter = require('./routes/index');
const getBookRouter = require('./routes/getBook');
const addBookRouter = require('./routes/addBook');
const updateBookRouter = require('./routes/updateBook');
const deleteBookRouter = require('./routes/deleteBook');
const editRouter = require('./routes/edit');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const primesRouter = require('./routes/primes');
const getJsonRouter = require('./routes/getJson');

app.use('/', indexRouter);
app.use('/getbook', getBookRouter);
app.use('/addbook', addBookRouter);
app.use('/updatebook', updateBookRouter);
app.use('/edit', editRouter);
app.use('/deletebook', deleteBookRouter);
app.use('/books', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/primes', primesRouter);
app.use('/getJson', getJsonRouter);

// display 404 for any mismatch routes
app.use((req, res, next) => {
  const options = {
    root: `${__dirname}/public/html`,
  };
  res.status(404);
  res.sendFile('404.html', options);
});

app.listen(port, () => {
  console.log(`Server listening @ ${hostname()}:${port}`);
});

```