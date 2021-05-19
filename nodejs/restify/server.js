require('dotenv').config();

const restify = require('restify');

const restifyJwt = require('restify-jwt-community');

// requiring our files that export our authorization function and routes
const auth = require('./auth');
const routes = require('./routes');

// setting up the RESTify server
let server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.use(restifyJwt({ "secret": process.env.SECRET_KEY }).unless({
  path: ['/auth/']
}));

// API ROUTES

// Auth
server.post('/auth/', auth.authorize);
// Books
server.get('/books/:id', routes.getBook);
server.post('/books/', routes.postBook);

// Start the server
server.listen(3030, function() {
  console.log('%s listening at %s', server.name, server.url);
});
