const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';

//Respond with Static Book Table
router.get('/', async (req, res) =>{
  let sql = `SELECT * FROM ${SCHEMA}.BOOKS`,
    title = 'View Books',
    data;

  try {
    data = await pool.prepareExecute(sql);
    console.log(data);
    res.render('staticTable.ejs', {title, data: data.resultSet, error: null} );

  } catch (err){
    console.log(`Error SELECTING ALL BOOKS:\n${err.stack}\n`);
    res.render('staticTable.ejs', {title, data: [], error: 'failed to load books data'} );
  }
});

module.exports = router;
