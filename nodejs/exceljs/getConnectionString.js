require('dotenv').config();

function getConnectionString() {
    let connectionString = 'DSN=*LOCAL;';

    if (process.env.DSN) { // using DSN to connect
      connectionString = `DSN=${process.env.DSN};`
    }

    if (process.env.DB_USER) { // using uid/password to connect
      connectionString = `DRIVER=IBM i Access ODBC Driver;UID=${process.env.DB_USER};`;
   
      if (!process.env.DB_PASS) {
        throw Error('"DB_PASS" environment variable must be defined');
      }

      connectionString += `PWD=${process.env.DB_PASS};`;
      connectionString += process.env.DB_HOST ? `SYSTEM=${process.env.DB_HOST};`
                                              : 'SYSTEM=localhost;';
    }

   return connectionString;
}

module.exports = getConnectionString;

