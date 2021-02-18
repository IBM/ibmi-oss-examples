const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ibmi = require('./ibmi_utils.js');

//
// config
//
const PORT = 4000;
const SECRET = crypto.randomBytes(32).toString('hex');

//
// helpers
//
function getUserProfile(req) {
    return req.session.passport ? req.session.passport.user : null;
}

// opens connection to specified server with given credentials; creates BOOKS
// table (if not already present). Returns connection object
function openConnection(username, password, server) {
    return null;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

//
// app setup
//
let app = express();

//parse req body & cookies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use('/assets', express.static(`${__dirname}/public`));

//
// security
//
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
    ibmi.processUserSignIn(username, password, 'oss72dev', function(err, user) {
        if (err) return done(`Error from ibmi signin: ${err}`, null);
        // store entire user object in session
        done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(username, done) {
    return done(null, username);
});

//
// auth urls
//

app.post('/signin', passport.authenticate('local'), function(req, res, next) {
    // Api will redirect to main page
    res.status(201).end('Signin success');
});

app.post('/signout', isLoggedIn, function(req, res, next) {
    // when we are done redirect to /login
    res.clearCookie('username');
    req.logOut();
    req.session.destroy();
    res.redirect('/login');
});

//
// app urls
//

app.get('/', isLoggedIn, function(req, res, next) {
    console.log(`=> ${JSON.stringify(getUserProfile(req))}`);
    return res.status(201).end('+++ INDEX +++');
});

app.get('/login', function(req, res, next) {
    return res.render('login');
});

app.listen(PORT, function() {
    console.log(`\nServer listening @ port ${PORT}\n`);
});
