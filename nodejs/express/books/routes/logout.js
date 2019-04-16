const router = require('express').Router();

//Respond with Login Page
router.get('/', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
