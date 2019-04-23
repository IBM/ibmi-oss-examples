#!/QOpenSys/pkgs/bin/node

const fcgi = require('node-fastcgi');
const url = require('url'); 
const fs = require('fs'); 

const fcgiServer = fcgi.createServer((req, res) => {
  // Replace .jsx with .js to get the real path.
  const app = __dirname + url.parse(req.url).pathname.slice(0, -1);

  fs.exists(app, (exists) => {
    if(exists){
      // Load the javascript module according the URL requested
      const handler = require(app);
      handler.process(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });
});
// fcgiServer.listen();  //Local mode
fcgiServer.listen(8088);  //Remote mode
