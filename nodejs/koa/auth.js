const passport      = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const { poolResolve, odbc } = require('./db');

// We can just pass the username back and forth to serialize/deserialize, other
// applications may need to add more logic
passport.serializeUser((user, done) => {
  done(null, user)
});

passport.deserializeUser(async (user, done) => {
  done(null, user)
});

// When we need to authenticate, use ODBC to create a database connection and
// make sure the credentials were valid
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // connect to the database to check our credentials! The profile will
    // also be used to handle authority lists for running Db2 queries
    pool = await odbc.pool(`DSN=*LOCAL;UID=${username};PWD=${password};`);

    // everyone who imported the poolPromise now can use it!
    poolResolve(pool);

    // create the table. Have to wait until we authenticate, because we are
    // using the authentication credentials for our database connection
    await pool.query("CREATE OR REPLACE TABLE KOA_BOOKS(TITLE VARCHAR(100) NOT NULL, AUTHOR VARCHAR(100) NOT NULL)");

    done(null, username);
  } catch (error) {
    done(null, null);
  }
}));
