const router = require('express').Router();
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');

router.get('/', async function(req, res) {
    let user = users.getCurrentUserRecord(req);
    ibmi.runSql(user.conn, 'SELECT * FROM BOOKSTORE.BOOKS', function(err, result) {
        if (err) {
            err = 'failed to load books data. Error: ' + err;
            result = [];
        } else {
            err = null;
        }
        res.render('dynamicTable.ejs', {title: 'Manage Books', data: result, error: err});
    });
});

module.exports = router;
