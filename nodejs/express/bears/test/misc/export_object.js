//console.log("/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2");
//var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2');
//for (var k in db) { console.log(k); }

console.log("/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a");
var dba = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');
console.log("\n===All about dba?===\n");
for (var k in dba) { console.log(k); }

console.log("\n===All about dba.dbconn?===\n");
var dbconn = new dba.dbconn();
for (var k in dbconn) { console.log(k); }

console.log("\n===All about dba.dbstmt?===\n");
var dbstmt = new dba.dbstmt(dbconn);
for (var k in dbstmt) { console.log(k); }


