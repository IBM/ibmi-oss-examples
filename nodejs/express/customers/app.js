const express = require('express');
const bodyParser = require('body-parser');
const { DBPool } = require('idb-pconnector');
const { hostname } = require('os');

const app = express();
const pool = new DBPool();
const port = process.env.PORT || 8001;


app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
// directory to serve static files
app.use('/public', express.static(`${__dirname}/public`));
// required to parse json encoded bodies
app.use(bodyParser.json());

// FRONTEND HTML ROUTES
app.get('/', async (req, res) => {
  try {
    const results = await pool.runSql('SELECT LSTNAM, CUSNUM FROM QIWS.QCUSTCDT order by CUSNUM ASC');
    res.render('customers/index', { title: 'Customers', results });
  } catch (error) {
    console.error(error);
    res.status(500).send('error processing your request');
  }
});

app.get('/customers/new', (req, res) => {
  res.render('customers/new', { result: {}, formMethod: 'POST' });
});

app.get('/customers/:id', async (req, res) => {
  const sql = 'SELECT CUSNUM, LSTNAM, INIT, STREET, CITY, STATE FROM QIWS.QCUSTCDT WHERE CUSNUM = ?';
  try {
    const data = await pool.prepareExecute(sql, [req.params.id]);
    res.render('customers/show', { title: 'Customer', result: data.resultSet[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('error processing your request');
  }
});

app.get('/customers/:id/edit', async (req, res) => {
  try {
    const data = await pool.prepareExecute('SELECT CUSNUM, LSTNAM, INIT, STREET FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [req.params.id]);
    res.render('customers/edit',
      {
        title: 'Customer',
        result: data.resultSet[0],
        formMethod: 'PUT',
        disable: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('error processing your request');
  }
});

// BACKEND API ROUTES
app.get('/api/customers', async (req, res) => {
  try {
    const results = await pool.runSql('SELECT LSTNAM, CUSNUM FROM QIWS.QCUSTCDT order by CUSNUM ASC');
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: 'failed to get customers' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  const sql = 'SELECT CUSNUM, LSTNAM, INIT, STREET, CITY, STATE FROM QIWS.QCUSTCDT WHERE CUSNUM = ?';
  try {
    const data = await pool.prepareExecute(sql, [req.params.id]);
    res.send(data.resultSet);
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: 'failed to get customer' });
  }
});

app.post('/api/customers/create', async (req, res) => {
  // TODO validate params
  const sql = 'INSERT INTO QIWS.QCUSTCDT (CUSNUM,LSTNAM,INIT,STREET,CITY,STATE) VALUES (?, ?, ?, ?, ?, ?) with NONE';
  const params = [req.body.CUSNUM, req.body.LSTNAM, req.body.INIT, req.body.STREET, req.body.CITY, req.body.STATE];

  console.log(params);

  try {
    await pool.prepareExecute(sql, params);
    res.send({ message: 'added customer' });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: 'failed to add customer' });
  }
});

app.put('/api/customers/update', async (req, res) => {
  const sql = 'UPDATE QIWS.QCUSTCDT SET LSTNAM = ?, INIT = ?, STREET = ?, CITY = ?, STATE = ? WHERE CUSNUM = ? with NONE';
  const params = [req.body.LSTNAM, req.body.INIT, req.body.STREET, req.body.CITY, req.body.STATE,
    req.body.CUSNUM];

  console.log(req.body);
  try {
    await pool.prepareExecute(sql, params);
    res.send({ message: 'updated customer' });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: 'failed to update customer' });
  }
});

app.delete('/api/customers/:id/delete', async (req, res) => {
  try {
    await pool.prepareExecute('DELETE FROM QIWS.QCUSTCDT WHERE CUSNUM = ? with NONE', [req.params.id]);
    console.log('delete was ok');
    res.send({ message: 'deleted customer' });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: 'failed to delete customer' });
  }
});

app.listen(port, () => {
  console.log(`Server running at:\nhttp://${hostname()}:${port}`);
});
