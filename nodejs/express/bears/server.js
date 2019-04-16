// BASE SETUP
// $ export UV_THREADPOOL_SIZE=64
// =============================================================================
// add more worker threads uv async db operations
// process.env.UV_THREADPOOL_SIZE = 64;

const express = require('express');
const bodyParser = require('body-parser');
const { hostname } = require('os');
const bb = require('./models/bear');

const bear = new bb.Bear();
const app = express();
const port = process.env.PORT || 47710; // set our port
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${__dirname}/public`));

// serve up webpage frontend
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/html/index.html`);
});

const api = express.Router(); // get an instance of the express Router

// middleware to use for all requests
api.use((req, res, next) => {
  next();
});

// ROUTES FOR OUR API
// =============================================================================

// test route to make sure everything is working
api.get('/', (req, res) => res.json({ message: 'hooray! welcome to our api!' }));

// on routes that end in /bears
// ----------------------------------------------------
// GET:/zoo/api/bears
// http://myibmi/zoo/api/bears
api.route('/bears')
  // get all the bears
  .get((req, res) => {
    bear.find((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    });
  });
// POST:/zoo/api/bears
// http://myibmi/zoo/api/bears
api.route('/bears')
  // create a bear
  .post((req, res) => {
    // set the bears name (comes from the request req.body.name)
    // save the bear and check for errors
    bear.save(req.body.name, (rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    });
  });
// GET:/zoo/api/bears/bear_id
// http://myibmi/zoo/api/bears/4
api.route('/bears/:bear_id')
  // get the bear with that id
  .get((req, res) => {
    // get the bear with id (comes from the request req.params.bear_id)
    bear.findById(req.params.bear_id, (rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    });
  });

// DELETE:/zoo/api/bears/bear_id
// http://myibmi/zoo/api/bears/4
api.route('/bears/:bear_id')
  // get the bear with that id
  .delete((req, res) => {
    // get the bear with id (comes from the request req.params.bear_id)
    bear.removeById(req.params.bear_id, (rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /zoo/api
app.use('/zoo/api', api);

// START THE SERVER
// =============================================================================
app.listen(port, () => {
  console.log(`Server running at:\nhttp://${hostname()}:${port}`);
});
