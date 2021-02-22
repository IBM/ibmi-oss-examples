const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');

//register middleware
router.use(urlencodedParser);

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let user = users.getCurrentUserRecord(req);
    let sql = `SELECT * FROM BOOKSTORE.BOOKS WHERE bookid = ${id}`;
    ibmi.runSql(user.conn, sql, function(err, result) {
        if (err) res.status(400).send({message:'Unable to get book'});
        else res.send(result[0]);
    });
});

module.exports = router;
