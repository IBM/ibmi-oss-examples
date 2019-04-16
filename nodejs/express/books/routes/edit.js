const router = require('express').Router();
const {pool} = require('../app.js');
const SCHEMA = 'BOOKSTORE';
const {checkLogin} = require('../utils.js');

//register middleware
router.use(checkLogin());

router.get('/', async (req, res) =>{
  let sql = `SELECT * FROM ${SCHEMA}.BOOKS`,
    title = 'Manage Books',
    data;

  try {
    data = await pool.prepareExecute(sql);
    console.log(data);
    res.render('dynamicTable.ejs', {title, data: data.resultSet, error: null} );
  }   catch (err){
    console.error(`Error SELECTING ALL BOOKS:\n${err.stack}`);
    res.render('dynamicTable.ejs', {title, data: [], error: 'failed to load books data'});
  }
});

module.exports = router;
