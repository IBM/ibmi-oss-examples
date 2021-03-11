const router = require('express').Router();
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');
const odbc = require('odbc');

//Respond with Static Book Table
router.get('/', async function(req, res) {
    let user = users.getCurrentUserRecord(req);
    ibmi.runSql(user.conn, 'SELECT * FROM BOOKSTORE.BOOKS', function(err, result) {
        res.render('staticTable.ejs', {title: 'View Books', data: result, error: null});
    })
});

module.exports = router;
