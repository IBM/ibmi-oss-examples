// The odbc connector used to connect to IBM i. If you haven't set up ODBC on
// your machine, see https://github.com/IBM/ibmi-oss-examples/tree/master/odbc
const odbc = require('odbc');

const poolPromise = new Promise((resolve, reject) => {
  this.poolResolve = resolve;
});

// because of how the odbc package works, and how we need to export the same
// object to all files before the pool is made, we have to get fancy:
// export a poolPromise, that is used by all files to obtain the same pool.
// export a poolResolve that will be used by functions that actually connect
//   to pass the real pool object (that will then be passed through the promise)
// export odbc, which be used to actually create the pool
const pool = {
  poolResolve: null,
  poolPromise: poolPromise,
  odbc: odbc
}

// export a promise that resolves to an ODBC pool. If other files want to use
// this pool, they should ensure that Promise has been resolved first.
module.exports.pool = pool.poolPromise;
module.exports.resolveFunction = pool.poolResolve;
module.exports.odbc = odbc;
