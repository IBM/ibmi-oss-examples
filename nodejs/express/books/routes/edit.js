const router = require('express').Router();
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');
const odbc = require('odbc');

router.get('/', async function(req, res) {
    let user = users.getCurrentUserRecord(req);
    ibmi.runSql(user.conn, 'SELECT * FROM BOOKSTORE.BOOKS', function(err, result) {
        if (err)
            res.render('dynamicTable.ejs', {title: 'Manage Books', data: [], error: 'failed to load books data. Error: ' + err});
        else
            res.render('staticTable.ejs', {title: 'Manage Books', data: result, error: null});
    })
});

module.exports = router;
