const url = require('url'); 
const { Connection, iWork } = require('itoolkit');
     
exports.process = (req, res) => {  // Implement the interface ‘process()’
  const key = url.parse(req.url, true).query.key.toUpperCase(); // Get the query key from the URL.
  const connection = new Connection({
    transport: 'idb',
    transportOptions: { database: '*LOCAL' }
  });
  
  const work = new iWork(connection);
  
  work.getSysValue('QCCSID', (error, output) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.write(error);
    }
    else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(`${key} = ${output}`); // Write the system value to the HTTP response.
    }
  });
};
