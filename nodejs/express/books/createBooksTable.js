const { DBPool } = require('idb-pconnector');

const pool = new DBPool({ url: '*LOCAL' }, { incrementSize: 1 });

async function createBooksTable() {
  const createSchema = 'CREATE SCHEMA BOOKSTORE';
  const createTable = `CREATE OR REPLACE TABLE
                 BOOKSTORE.Books(bookId INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(START WITH 1, INCREMENT BY 1),
                 title VARCHAR(30) NOT NULL,
                 isbn VARCHAR(20) NOT NULL,
                 amount DECIMAL(10 , 2) NOT NULL, PRIMARY KEY (bookId))`;
  await pool.runSql(createSchema);
  await pool.runSql(createTable);
  console.log('BOOKSTORE.Books Table Created!');
}

async function addBook(title, isbn, amount) {
  const sql = 'INSERT INTO BOOKSTORE.BOOKS(title, isbn, amount) VALUES (?, ?, ?)';
  await pool.prepareExecute(sql, [title, isbn, amount]);
  console.log('Added new Book!');
}

createBooksTable()
  .then(() => {
    addBook('The Great Gatsby', '9780743273565', 10.11);
  })
  .catch((error) => {
    console.error(error);
  });

exports.createBooksTable = createBooksTable;
