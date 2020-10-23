const Koa        = require('koa');
const app        = new Koa();
const session    = require('koa-session');
const bodyParser = require('koa-bodyparser');
const passport   = require('koa-passport');
const connection = require('./db');

// load the routes
const mainRoutes = require('./routes');

// set the port to any environment 
const PORT = process.env.PORT || 3006;
app.use(mainRoutes.routes());

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// body parser
app.use(bodyParser());

// include authentication logic
require('./auth');
app.use(passport.initialize());
app.use(passport.session());


// Setting up the database tables for this application to run.
// Your application will probably use tables that are already set up.
async function setupDatabaseTable() {
  try {
    const pool = await connection;
    await pool.query("CREATE OR REPLACE TABLE KOA_BOOKS(TITLE VARCHAR(100) NOT NULL, AUTHOR VARCHAR(100) NOT NULL)");
  } catch (error) {
    console.error(error);
  }
}

// Create a pool of ODBC connections and start the application
async function startServer() {
  await setupDatabaseTable();
  app.listen(PORT, () => console.log('Server listening on', PORT));
}

// Start the server
startServer();