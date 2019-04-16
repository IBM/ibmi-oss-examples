
# Adding Authentication to End Points.

Now that we have a framework for our routes we need to provide authentication to endpoints we only want accessible to users who are logged in. To do so we will use sessions and cookies to maintain state between requests. There are many packages we can install to accomplish this goal but one popular choice is [express-sessions](https://www.npmjs.com/package/express-session). `express-sessions` is a middleware which stores session data on the server and sets an encrypted cookie to the client. This will allow us to validate and check whether or not the user is authenticated. There is much to learn about sessions and cookies and I advise you to read the [express-session README](https://github.com/expressjs/session).

`npm i express-session`
Before we can use any the Authentication packages we must require it as the following.

```javascript
// authentication
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ibmiAuth = require('./ibmiAuth').QSYSGETPH;
```

We will register and configure our session as follows:

```javascript
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  // use secure cookie if you have https enabled
  // cookie: { secure: true }
}));
```

**Warning** The default server-side session storage, `MemoryStore`, is _purposely_ not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

For a list of stores, see [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).

**Warning**: This Project is meant to be run locally on your IBM i for development purposes. Use good judgement and do not test the project on an open port. By default HTTP is used therefore when submitting the login form the credentials could be sniffed. For Production Use HTTPS and set the cookie secure flag to true.


Secret is unique key to sign the cookie should be a random sequence of characters. It is recommended to store the secret within environment variable on your machine. That way you do not accidentally commit your secret to github and your secret remains a secret.

When a `SECRET` environment variable is not set one will be generated.

```javascript
const secret = process.env.SECRET || generateSecret();
```

If `saveUninitialized` is set to true , Cookie will be given to user even if is not logged in , make sure this is set to false.

There are many ways to authenticate an IBM i user profile. One way is to call the [QSYGETPH](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/apis/QSYGETPH.htm) with the help of the [itoolkit](https://github.com/IBM/nodejs-itoolkit). Another simpler approach is attempt to create a database connection as the user with either `idb-connector` or `idb-pconnector`.

Another package we will use to authenticate is [passport.js](http://www.passportjs.org/). Passport makes authentication easier by providing built in methods to log the user in , log the user out , and check whether the user is authenticated. Passport has many different strategies to authenticate we will use a local strategy to authenticate a username and password.

```javascript
app.use(passport.initialize());
app.use(passport.session());

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
```

`passport.initialize()` middleware is required to initialize Passport. `passport.session` middleware used to maintain persistent sessions. In order to support login sessions, Passport will serialize and deserialize 'user' instances to and from the session. In our case we only serialize the username making it accessible while the session is active. The most widely used way for websites to authenticate users is via a username and password. Support for this mechanism is provided by the passport-local module. Within our local strategy we attempt to create a database connection to validate the user. This is done within the ibmiAuth function.

```javascript
function ibmiAuth(user, password, cb) {
  const { dbconn } = require('idb-connector');

  const connection = new dbconn();
  try {
    connection.conn('*LOCAL', user, password);
    connection.disconn();
    cb(null, true);
    console.log('login successful');
  } catch (error) {
    console.error(error);
    cb(true, null);
  } finally {
    connection.close();
  }
}
```

If successful then the username is serialized within the session. Passport provides useful methods such as `isAuthenticated` that can be used to check whether or not the user has has already logged in. We use this method to create a custom middleware called check login to verify login on protected endpoints.

```javascript
function checkLogin() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log(`\n[Session Info]: ${JSON.stringify(req.session)}\n`);
      return next();
    }
    res.render('login', { error: 'Must Login to Access Page' });
  };
}
```

And is called on the routes we want to protect.

For Example:

```javascript
//Ensure User is Authenticated First
//Then Respond With Editable Table
app.get('/edit', checkLogin(), async (req, res) =>{
  try {
    let sql = `SELECT * FROM ${SCHEMA}.BOOKS`,
      title = 'ALL BOOKS',
      results;

    results = await pool.prepareExecute(sql);
    console.log(results);
    res.render('dynamicTable.ejs', {title: title, results: results} );
  }   catch (err){
    console.log(`Error SELECTING ALL BOOKS:\n${err.stack}`);
  }
});

```