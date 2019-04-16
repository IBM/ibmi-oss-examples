const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';
const {checkLogin} = require('../utils.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

//register middleware
router.use(urlencodedParser);
router.use(checkLogin());
//add a new book
router.post('/', async (req, res) =>{
  console.log(`${req.body.title} ${req.body.isbn} ${req.body.amount}`);
  //TODO validate form inputs
  let title = req.body.title,
    isbn = req.body.isbn,
    amount = parseFloat(req.body.amount).toFixed(2);

  //add book to the DB
  try {
    let sql = `INSERT INTO ${SCHEMA}.BOOKS(title, isbn, amount) VALUES (?, ?, ?)`;

    results = await pool.prepareExecute(sql, [title, isbn, amount]);
    res.send({message: 'add was successful'});
  }   catch (err){
    res.status(400).send({message:'Unable to add book'});
    console.log(`Error ADDING NEW BOOK:\n${err.stack}`);
  }
});

module.exports = router;
