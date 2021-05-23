const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ibmi = require('./ibmi_utils.js');
const users = require('./users.js');
const flash = require('connect-flash');

//
// config
//
const userAtHost = process.env.USER_AT_HOST;
const iniFile = require('./parse-ini')({ tunneling: (!!userAtHost) });

const dsns = Object.keys(iniFile);

const PORT = 4000;
const SECRET = crypto.randomBytes(32).toString('hex');

//
// app setup
//
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

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
app.use(flash());

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        let { host, dsn } = req.body;
        if (dsn) {
            host = iniFile[dsn].System
        }
        ibmi.processUserSignIn(host, username, password, function(err, user) {
            if (err) return done(`Error from ibmi signin: ${err}`, null);
            // save user record
            users.List[user.username] = user;
            // call passport callback
            done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    return done(null, users.List[username]);
});

// middleware function so that views can check if authenticated with locals
app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

//
// auth urls
//

app.post('/signin', passport.authenticate('local'), function(req, res, next) {
    // Api will redirect to main page
    res.status(201).end('Signin success');
});

app.get('/signout', isLoggedIn, function(req, res, next) {
    // when we are done redirect to /login
    res.clearCookie('username');
    req.logOut();
    req.session.destroy();
    res.redirect('/login');
});

//
// app urls
//

const indexRouter = require('./routes/index');
const editRouter = require('./routes/edit');
const addBookRouter = require('./routes/addBook');
const getBookRouter = require('./routes/getBook');
const deleteBookRouter = require('./routes/deleteBook');
const updateBookRouter = require('./routes/updateBook');

app.get('/', isLoggedIn, indexRouter);
app.use('/books', isLoggedIn, indexRouter);
app.use('/edit', isLoggedIn, editRouter);
app.use('/addbook', isLoggedIn, addBookRouter);
app.use('/getbook', isLoggedIn, getBookRouter);
app.use('/deletebook', isLoggedIn, deleteBookRouter);
app.use('/updatebook', isLoggedIn, updateBookRouter);

app.get('/login', function(req, res, next) {
    return res.render('login', { dsns });
});

// display 404 for any mismatch routes
app.use(function(req, res, next) {
    return res.status(404).sendFile('404.html', {root: `${__dirname}/public/html`});
});

app.listen(PORT, function() {
    console.log(`\nServer listening @ port ${PORT}\n`);
});
