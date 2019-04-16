const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';

router.get('/:id', async (req, res) =>{
  try {
    let sql = `SELECT * FROM ${SCHEMA}.BOOKS WHERE bookid = ?`;

    let results = await pool.prepareExecute(sql, [req.params.id], {io: 'in'});

    if (results){
      //return the book as json
      res.send(results.resultSet[0]);
      return;
    }

    res.send({});

  } catch (err){
    console.error(`Error SELECTING BY Book id:\n${err.stack}`);
    res.status(400).send({error: 'Unable to get book'});
  }
});

module.exports = router;
