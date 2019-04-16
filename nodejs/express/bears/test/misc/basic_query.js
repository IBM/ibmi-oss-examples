var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');
var mode = true;
var dbconn = new db.dbconn();  // Create a connection object.
dbconn.conn("*LOCAL");  // Connect to a database.
var stmt = new db.dbstmt(dbconn);  // Create a statement object of the connection.
// stop for input to check server mode
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// run statement
var sql = "SELECT STATE,LSTNAM FROM QIWS.QCUSTCDT";
stmt.exec(sql, function(result) {
  console.log("Result: %s", JSON.stringify(result));
  var fieldNum = stmt.numFields();
  console.log("There are %d fields in each row.", fieldNum);
  console.log("Name | Length | Type | Precise | Scale | Null");
  for(var i = 0; i < fieldNum; i++) {
    console.log("%s | %d | %d | %d | %d | %d", stmt.fieldName(i), stmt.fieldWidth(i), stmt.fieldType(i), stmt.fieldPrecise(i), stmt.fieldScale(i), stmt.fieldNullable(i));
  }
  rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log('Thank you for your valuable feedback:', answer);

    delete stmt;  // Clean up the statement object.
    dbconn.disconn();  // Disconnect from the database.
    delete dbconn;  // Clean up the connection object.

    rl.close();
  });
});


