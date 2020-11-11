const poolPromise = require('./db').pool;
const errors = require('restify-errors');

// Retrieve a book from the database
async function getBook (req, res, next) {
  let id = req.params.id;
  let pool = await poolPromise;

  try {
    const result = await pool.query('SELECT * FROM BOOKS WHERE ID = ?', [id]);
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      return next(new errors.NotFoundError(`Could not find book with id ${id} in the database.`));
    }
  } catch (error) {
    return next(new errors.InternalServerError("Internal Server Error"));
  }
  
  next();
}

// Write a book to our database table
async function postBook (req, res, next) {

  let pool = await poolPromise;

  // the body of the request should be in the format { title: 'title', author: 'author' }
  let payload = req.body;
  if (!(payload.hasOwnProperty('title') && payload.hasOwnProperty('author'))) {
    return next(new errors.BadRequestError("Your request wasn't formatted correctly. Pass a title and an author"));
  }
  try {
    // Add the book to the table, and use SELECT ID FROM FINAL to get the ID
    // from that inserted value
    const result = await pool.query('SELECT ID FROM FINAL TABLE(INSERT INTO BOOKS (TITLE, AUTHOR) VALUES(?, ?))', [payload.title, payload.author]);
    console.log(result);
    res.send( { id: result[0].ID });
  } catch (error) {
    return next(new errors.InternalServerError("Internal Server Error"));
  }

  next();
}

module.exports.getBook = getBook;
module.exports.postBook = postBook;
