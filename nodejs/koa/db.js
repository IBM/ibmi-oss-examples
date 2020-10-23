// The odbc connector used to connect to IBM i. If you haven't set up ODBC on
// your machine, see https://github.com/IBM/ibmi-oss-examples/tree/master/odbc
const odbc = require('odbc');

// export a promise that resolves to an ODBC pool. If other files want to use
// this pool, they should ensure that Promise has been resolved first.
module.exports = new Promise(async (resolve, reject) => {
  try {
    const pool = await odbc.pool('DSN=*LOCAL');
    resolve(pool);
  } catch (error) {
    reject(error);
  }
});