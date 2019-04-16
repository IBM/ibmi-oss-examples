var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');
var dbconn = new db.dbconn();  // Create a connection object.
dbconn.conn("*LOCAL");  // Connect to a database.
var stmt = new db.dbstmt(dbconn);  // Create a statement object of the connection.
var sql = "SELECT USER FROM SYSIBM.SYSDUMMY1";
stmt.execSync(sql, function(result) {
  console.log("Result: %s", JSON.stringify(result));
  console.log("Result: %s", result[0]["00001"]);
});
delete stmt;
dbconn.disconn();
delete conn;

