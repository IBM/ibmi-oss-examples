const passport      = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const QSYSGETPH     = require('./ibmiAuth').QSYSGETPH;

passport.serializeUser((user, done) => {
  done(null, user)
});

passport.deserializeUser(async (user, done) => {
  done(null, user)
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    await QSYSGETPH(username, password);
    done(null, username);
  } catch (error) {
    done(error);
  }
}));