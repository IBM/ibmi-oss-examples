const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const passport = require('../app').passport;

//Respond with Login Page
router.get('/', (req, res) => {
  // Test flash messages in the console
  let errors = req.flash('error');
  if (errors.length){
    console.log( errors[0] ); // This returns a string
  }
  res.render('login', {error: errors[0]});
});

//Only Process Login for a post to /login
router.post('/', urlencodedParser,passport.authenticate('local', {
  successRedirect: '/edit',
  failureRedirect: '/login',
  failureFlash: 'Invalid Username or password'
}));

module.exports = router;
