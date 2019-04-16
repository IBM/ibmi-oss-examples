
/*
  middleware function to check if authenticated
  before allowing access to secure routes
  req.isAuthenticated is provided by Passport.js
  Passport should be initialized and setup before use
*/
function checkLogin() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log(`\n[Session Info]: ${JSON.stringify(req.session)}\n`);
      return next();
    }
    res.render('login', { error: 'Must Login to Access Page' });
  };
}

function ibmiAuth(user, password, cb) {
  // eslint-disable-next-line global-require
  const { dbconn } = require('idb-connector');

  // eslint-disable-next-line new-cap
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

function generateSecret() {
  // eslint-disable-next-line global-require
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(new Date().toString()).digest('hex');
}

exports.generateSecret = generateSecret;
exports.checkLogin = checkLogin;
exports.ibmiAuth = ibmiAuth;
