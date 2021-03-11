const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const ibmi = require('../ibmi_utils.js');
const users = require('../users.js');

//register middleware
router.use(urlencodedParser);

//remove a book by its id
router.delete('/:id', async(req, res) => {
    let id = req.params.id;
    let user = users.getCurrentUserRecord(req);
    let sql = `DELETE FROM BOOKSTORE.BOOKS WHERE BOOKID = ${id}`;
    ibmi.runSql(user.conn, sql, function(err, result) {
        if (err) res.status(400).send({message:'Unable to delete book'});
        else res.send({message: 'delete was successful'});
    });
});

module.exports = router;
