require('dotenv').config();

function getConnectionString() {
    let connectionString = `DRIVER=IBM i Access ODBC Driver;`;

     if (!process.env.DB_USER) {
         throw Error('"DB_USER" environment variable must be defined');
     }

     if (!process.env.DB_PASS) {
        throw Error('"DB_PASS" environment variable must be defined');
     }

     connectionString += `UID=${process.env.DB_USER};PWD=${process.env.DB_PASS};`;
     connectionString += process.env.DB_HOST ? `SYSTEM=${process.env.DB_HOST};`
                                             : `SYSTEM=${localhost};`;

     return connectionString;
}

module.exports = getConnectionString;

