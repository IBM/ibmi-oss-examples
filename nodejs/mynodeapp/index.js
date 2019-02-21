const express = require('express')
const app = express()
const port = 8081

app.use(express.static('public'))

app.get('/query', (req, res) => {
  const {dbconn, dbstmt} = require('idb-connector');
  const sql = req.query.sql;
  const connection = new dbconn();
  connection.conn("*LOCAL");
  const statement = new dbstmt(connection);
  statement.exec(sql, (x) => {
    res.send(JSON.stringify(x));
    statement.close();
    connection.disconn();
    connection.close();
  });
})

app.get('/cmd', (req, res) => {
  const {iConn, iSh, xmlToJson} = require('itoolkit');
  const cl = req.query.cl;
  const conn = new iConn("*LOCAL");
  conn.add(iSh("system -i " + cl));
  conn.run((x) => {
    res.send(xmlToJson(x)[0].data);
  }); 
})

app.listen(port, () => console.log(`Server running on port ${port}!`))
