const bcrypt     = require('bcrypt');
const odbc       = require('odbc');
const saltRounds = 12;

// This example runs on IBM i using *LOCAL credentials. This will use the 
// user profile of whoever runs the server, including their authorization lists.
// If you want to run this example on another system and connect to IBM i, need
// to change the connection string to connect remotely!
let pool = odbc.pool('DSN=*LOCAL');

setupDatabase();

async function setupDatabase() {

  // for this example to work in a contained manner, need to set up our Db2 for
  // i schema by creating a table to hold our Books and a table to hold User
  // information (username and password hash).
  try {
    let localPool = await pool;

    await localPool.query("CREATE OR REPLACE TABLE BOOKS(ID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1), TITLE VARCHAR(32) NOT NULL, AUTHOR VARCHAR(32), PRIMARY KEY (ID))");

    await localPool.query("CREATE OR REPLACE TABLE USERS(USERNAME VARCHAR(32) NOT NULL, PASSWORD_HASH VARCHAR(128) NOT NULL)");

    // For this example, we seed our users table with a user. We DON'T EVER
    // STORE THE PASSWORD IN PLAIN TEXT! Instead we store the hash.
    const user = 'Mark';
    const password = 'My@Password12345!';
    const hash = await bcrypt.hash(password, saltRounds);

    // insert a user into the table, so that we can test that authentication
    // works
    await localPool.query("INSERT INTO USERS VALUES(?, ?)", [user, hash]);

  } catch (error) {
    console.error("Error is " + error);
  }
}

module.exports.pool = pool;
