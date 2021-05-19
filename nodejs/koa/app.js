const Koa        = require('koa');
const app        = new Koa();
const session    = require('koa-session');
const bodyParser = require('koa-bodyparser');

// load the routes
const router     = require('./routes');

// set the port to any environment 
const PORT = process.env.PORT || 3006;

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// body parser
app.use(bodyParser());

// include authentication logic
require('./auth');
const passport   = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(router.routes());

app.listen(PORT, () => console.log('Server listening on', PORT));
