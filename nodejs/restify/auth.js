const poolPromise = require('./db').pool;
const jwt         = require('jsonwebtoken');
const errors      = require('restify-errors');
const bcrypt      = require('bcrypt');

async function authorize(req, res, next) {

  let { username, password } = req.body;

  try {
    const data = await authenticate(username, password);
    // with the username we were given back, generate a JWT with our secret
    // key found in .env
    let token = jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: '15m' // token expires in 15 minutes
    });
    // return the generated token
    res.send({ token });
  } catch (error) {
    // for any error we get from authenticate, just want to throw a 401 error
    return next(new errors.UnauthorizedError('Bad Credentials'));
  }

  return next();
}

// helper function, not exported
// determines whether the given password was valid for the user by comparing
// it with the hash stored in the database
async function authenticate(username, password) {

    let pool = await poolPromise;

    // retrieve the password hash we have stored in the database
    const result = await pool.query('SELECT PASSWORD_HASH FROM USERS WHERE USERNAME = ?', [username]);
    if (result.length == 0) {
      // error will get overwritten in authorize function, just need to throw
      throw Error();
    }

    // compare the password the client gave against the hash in the table
    const validPassword = await bcrypt.compare(password, result[0]['PASSWORD_HASH']);
    if (validPassword) {
      // if the password was valid, return the username. Normally you would
      // likely pass a larger object, for for the simplicity of this example,
      // only need the username.
      return { username: username };
    } else {
      // error will get overwritten in authorize function, just need to throw
      throw Error();
    }
}

module.exports.authorize = authorize;
