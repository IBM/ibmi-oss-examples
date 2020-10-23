const passport      = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const QSYGETPH     = require('./ibmiAuth').QSYGETPH;

// We can just pass the username back and forth to serialize/deserialize, other
// applications may need to add more logic
passport.serializeUser((user, done) => {
  done(null, user)
});

passport.deserializeUser(async (user, done) => {
  done(null, user)
});

// Our strategy is simply to call QSYGETPH API and see if the username/password
// combination is valid
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    await QSYGETPH(username, password);
    done(null, username);
  } catch (error) {
    done(error);
  }
}));