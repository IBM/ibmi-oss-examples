const url = require('url'); 
const db = require('idb-connector');
const xt = require('itoolkit');
const wk = require('itoolkit/lib/iwork');
     
exports.process = function(req, res) {  // Implement the interface ‘process()’
  const key = url.parse(req.url, true).query.key.toUpperCase(); // Get the query key from the URL.
  const conn = new xt.iConn('*LOCAL');
  const work = new wk.iWork(conn);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(key + ' = ' + work.getSysValue(key)); // Write the system value to the HTTP response.
};