const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';
const {checkLogin} = require('../utils.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

//register middleware
router.use(checkLogin());
router.use(urlencodedParser);
//update an exsisting book
router.put('/', async (req, res) =>{
  try {
    let title = req.body.title,
      isbn = req.body.isbn,
      amount = parseFloat(req.body.amount).toFixed(2),
      id = parseInt(req.body.id);

    let sql = `UPDATE ${SCHEMA}.BOOKS SET TITLE = ?, ISBN = ?, AMOUNT = ?
                 WHERE BOOKID = ?`;

    await pool.prepareExecute(sql, [title, isbn, amount, id]);
    res.send({message: 'update was successful'});
  } catch (err){
    console.error(`Error UPDATING BOOK:\n${err.stack}`);
    res.status(400).send({error: 'Unable to update book'});
  }
});

module.exports = router;
