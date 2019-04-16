# Setting up Routes

Now that we have setup express and can connect to DB2 it is time to setup the routes to our express app. Below we have stub routes that we be the foundation to our application. The HTTP verbs make it easy to understand what each route should do. For example when a POST request arrives at `/login` we should process the login form. When a GET Request arrives at the `/login` we should render the login page to the user. The `urlencodedParser` is a middleware function used to retrieve information from the body of the HTTP Request. We could have register the middle ware with express but we do not need to parse the body for each request. Instead we only parse the body for the routes that we have to.

```javascript

//Routes
app.get('/', async (req, res) =>{
  res.redirect('/books');
});

//Respond with Static Book Table
app.get('/books', async (req, res) =>{
  try {
    let sql = `SELECT * FROM ${SCHEMA}.BOOKS`,
      title = 'ALL BOOKS',
      results;

    results = await pool.prepareExecute(sql);
    console.log(results);
    res.render('staticTable.ejs', {title: title, results: results} );

  }   catch (err){
    console.log(`Error SELECTING ALL BOOKS:\n${err.stack}`);
  }
});

// get a specific book by id
app.get('/getbook/:id', async (req, res) =>{
  try {
    let sql = `SELECT * FROM ${SCHEMA}.BOOKS WHERE bookid = ?`,
      results;

    results = await pool.prepareExecute(sql, [req.params.id]);

    if (results !== null){
      //return the book as json
      res.json(results);
    } else {
      res.send('no results');
    }
  }   catch (err){
    console.log(`Error SELECTING BY Book id:\n${err.stack}`);
  }

});

//Ensure User is Authenticated First
//Then Respond With Editable Table
app.get('/edit', async (req, res) =>{
  try {
    let sql = `SELECT * FROM ${SCHEMA}.BOOKS`,
      title = 'ALL BOOKS',
      results;

    results = await pool.prepareExecute(sql);
    console.log(results);
    res.render('dynamicTable', {title: title, results: results} );
  }   catch (err){
    console.log(`Error SELECTING ALL BOOKS:\n${err.stack}`);
  }
});


//add a new book
app.post('/addbook', urlencodedParser, async (req, res) =>{
  //TODO validate form inputs
  let title = req.body.title,
    isbn = parseInt(req.body.isbn),
    amount = parseFloat(req.body.amount).toFixed(2);

    //add book to the DB
  try {
    let sql = `INSERT INTO ${SCHEMA}.BOOKS(title, isbn, amount) VALUES (?, ?, ?)`,
      results = null,
      book = {};

    results = await pool.prepareExecute(sql, [title, isbn, amount]);
    res.send(true);
  }   catch (err){
    res.send(false);
    console.log(`Error ADDING NEW BOOK:\n${err.stack}`);
  }

});

//update an exsisting book
app.put('/updateBook', checkLogin(), urlencodedParser, async (req, res) =>{
  try {
    let title = req.body.title,
      isbn = parseInt(req.body.isbn),
      amount = parseFloat(req.body.amount).toFixed(2),
      id = parseInt(req.body.id);

    let sql = `UPDATE ${SCHEMA}.BOOKS SET TITLE = ?, ISBN = ?, AMOUNT = ?
               WHERE BOOKID = ?`;

    await pool.prepareExecute(sql, [title, isbn, amount, id]);
    res.send(true);
  } catch (err){
    res.send(false);
    console.log(`Error UPDATING BOOK:\n${err.stack}`);
  }
});


//remove a book by its id
app.delete('/deletebook/:id', checkLogin(), async(req, res) =>{
  try {
    let sql = `DELETE FROM ${SCHEMA}.BOOKS WHERE BOOKID = ${req.params.id}`,
      connection = await pool.attach(),
      affectedRows;

    await connection.getStatement().prepare(sql);
    await connection.getStatement().execute();
    affectedRows = await connection.getStatement().numRows();

    if (affectedRows > 0){
      res.send(true);
    } else {
      res.send(false);
    }

  }   catch (err){
    console.log(`Error DELETING BOOK:\n${err.stack}`);
  }
});
```