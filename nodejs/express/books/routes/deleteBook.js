const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';
const {checkLogin} = require('../utils.js');

//register middleware
router.use(checkLogin());

//remove a book by its id
router.delete('/:id', async(req, res) =>{
  try {
    let sql = `DELETE FROM ${SCHEMA}.BOOKS WHERE BOOKID = ?`,
      results;

    results = await pool.prepareExecute(sql, [req.params.id], {io: 'in'});

    res.send({message: 'delete was successful'});

  } catch (err){
    res.status(400).send({message: 'Unable to delete book'});
    console.log(`Error DELETING BOOK:\n${err.stack}`);
  }
});

module.exports = router;
