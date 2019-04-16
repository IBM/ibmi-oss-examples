# Connecting to DB2

One of the most important tasks of any web server is to communicate with a back-end data store, most commonly a database. Connecting to DB2 is made easier through packages such as `idb-pconnector`(), which can be found on npm. To install it, navigate to your projects directory and run:

```text
npm install idb-pconnector --save
```

From there we can require idb-pconnector and use it within our application. Documentation for the idb-pconnector and examples can be found at the [repository](hhttps://github.com/IBM/nodejs-idb-pconnector/tree/master/docs). For this tutorial we will make use of the connection pooling functionality built into idp-connector package. 

We can require the pool with:

```javascript
// idb-pconnector
const { DBPool } = require('idb-pconnector');

const url = process.env.DATABASE || '*LOCAL';
const username = process.env.DBUSER || '';
const password = process.env.DBPASS || '';

const pool = new DBPool({ url, username, password }, { debug: true });
```

Within the DBPool constructor The first parameter is an object containing the `url`\(database name\), `username`, and `password.` These values can be configured by setting `DATABASE`, `DBUSER`, and `DBPASS` environment variables. If the `DATABASE` is not set default is to use `*LOCAL`. If `DBUSER` and `DBPASS` is not set an empty string is used. When connecting to `*LOCAL` username and password are optional the current user will be used.

The second parameter is an object which contains the `incrementSize` and `debug`. Increment size sets the desired size of the DB Pool. If none specified, defaults to 8 connections. Setting debug = true will display verbose output to stdout.

Now that we can connect to DB2 we need to create a table that will store our books. Within the project there is a file named code `createBooksTable.js`. The purpose of this file is to create schema and table as well as add one book to our table. We only need to run this code once during initial setup. this is done by running `npm run setup` or `node createBooksTable.js` from the command line.

```javascript
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

```