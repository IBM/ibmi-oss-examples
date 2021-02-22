const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');

//register middleware
router.use(urlencodedParser);

//add a new book
router.post('/', async (req, res) => {
    //TODO validate form inputs
    let title = req.body.title,
        isbn = req.body.isbn,
        amount = parseFloat(req.body.amount).toFixed(2);

    //add book to the DB
    let user = users.getCurrentUserRecord(req);
    let sql = `INSERT INTO BOOKSTORE.BOOKS(title, isbn, amount) VALUES ('${title}', ${isbn}, ${amount})`;
    ibmi.runSql(user.conn, sql, function(err, result) {
        if (err) res.status(400).send({message:'Unable to add book'});
        else res.send({message: 'add was successful'});
    });
});

module.exports = router;
