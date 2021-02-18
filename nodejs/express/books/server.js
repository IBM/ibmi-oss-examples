const express = require('express');

//
// config
//
const PORT = 4000;

//
// globals
//

// Dictionary username -> user
let Users = {};

//
// helpers
//
function newUser(username, password, server) {
    // username is primary key
    // conn is connection to ibmi server
    return {username: username, password: password, server: server, connection: null};
}

// opens connection to specified server with given credentials; creates BOOKS
// table (if not already present). Returns connection object
function openConnection(username, password, server) {
    return null;
}

//
// app setup
//
let app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use('/assets', express.static(`${__dirname}/public`));

//
// auth urls
//

app.post('/signup', function(req, res, next) {
    // on success api will redirect to /signin
    return res.status(201).end('/signup');
});

app.post('/login', function(req, res, next) {
    // on success api will redirect to main page
    return res.status(201).end('/signin');
});

app.post('/signout', function(req, res, next) {
    // when we are done redirect to /login
    return res.status(201).end('/signout');
});

//
// app urls
//

app.get('/', function(req, res, next) {
    return res.status(201).end('+++ INDEX +++');
});

app.get('/login', function(req, res, next) {
    return res.render('/login');
});

app.listen(PORT, function() {
    console.log(`\nServer listening @ port ${port}\n`);
});
