const Hapi = require('@hapi/hapi');
const cookie = require('@hapi/cookie');
const pug = require('pug'); // Template engine
const vision = require('vision'); // Templates rendering plugin support for hapi.js.
const inert = require('inert'); // Static file and directory handlers plugin for hapi.js.
const { Connection } = require('idb-pconnector');
const uuidv4 = require('uuid/v4');

const connectionMap = {};
const port = process.env.PORT || 8000;
// time in ms to end session and cleanup
const expiration = 10 * 60 * 1000; // 10 min to seconds -> 5 * 60 -> to ms -> * 1000

async function init() {
  const server = Hapi.server({
    port,
    routes: {
      files: {
        relativeTo: `${__dirname}/public`,
      },
    },
  });

  await server.register(inert);
  await server.register(vision);
  await server.register(cookie);

  const cache = server.cache({ segment: 'sessions' });

  server.app.cache = cache;

  // DOC: https://hapijs.com/tutorials/auth?lang=en_US#cookie
  server.auth.strategy('session', 'cookie', {
    cookie: {
      password: process.env.PASSWORD || uuidv4(),
      name: 'hapi-ibmi-auth',
      isSecure: false, // for production set this to true
    },
    redirectTo: '/login',
    async validateFunc(request, session) {
      const cached = await cache.get(session.sid);

      if (!cached) {
        return { valid: false };
      }

      if (cached.sid !== session.sid) {
        return { valid: false };
      }

      return { valid: true, credentials: cached };
    },
  });

  server.auth.default('session');

  server.views({
    engines: { pug },
    path: `${__dirname}/views`,
    compileOptions: {
      pretty: true,
    },
  });

  // route allows static files to be accessible from public/ dir
  server.route({
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: {
      directory: {
        path: '.',
        listing: false,
        index: true,
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    options: {
      auth: { mode: 'try' },
    },
    handler(request, h) {
      return h.view('index', {
        loggedIn: request.auth.isAuthenticated,
        title: 'Customer Search',
      });
    },
  });

  server.route({
    method: 'GET',
    path: '/login',
    options: {
      auth: { mode: 'try' },
      plugins: {
        'hapi-auth-cookie': { redirectTo: '/customers' },
      },
      handler(request, h) {
        if (request.auth.isAuthenticated) {
          return h.redirect('/customers');
        }
        return h.view('login', {
          loggedIn: request.auth.isAuthenticated,
          messages: 'To login please specify your profile and password.',
        });
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/login',
    options: { auth: false },
    async handler(request, h) {
      const { profile, password } = request.payload;
      try {
        const connection = new Connection({ url: '*LOCAL', username: profile, password });
        const sid = uuidv4();
        request.cookieAuth.set({ sid, profile });
        await request.server.app.cache.set(sid, { sid }, expiration);
        connectionMap[sid] = { connection, timestamp: new Date().getTime(), inUse: false };
        return h.redirect('customers');
      } catch (error) {
        console.log('error was: ', error);
        return h.view('login', {
          loggedIn: request.auth.isAuthenticated,
          profile,
          messages: 'login failed. Please try again',
        });
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      async handler(request, h) {
        const { sid } = request.auth.credentials;
        await request.server.app.cache.drop(sid);
        request.cookieAuth.clear();

        return h.redirect('/');
      },
    },
  });


  server.route({
    method: 'GET',
    path: '/customers',
    async handler(request, h) {
      const { sid } = request.auth.artifacts;

      if (!request.query.search_str) {
        return h.view('customers', {
          customers: [],
          loggedIn: request.auth.isAuthenticated,
        });
      }
      const searchStr = request.query.search_str.toUpperCase();

      const sql = `select * from QIWS.QCUSTCDT \
                  WHERE (UPPER(CUSNUM) LIKE '%${searchStr}%' or \
                  UPPER(LSTNAM) LIKE '%${searchStr}%' or \
                  CAST(ZIPCOD AS VARCHAR(5)) LIKE '%${searchStr}%') \
                  LIMIT 20`;

      const statement = connectionMap[sid].connection.getStatement();
      connectionMap[sid].inUse = true;

      try {
        const result = await statement.exec(sql);
        console.log(result);

        return h.view('customers', {
          loggedIn: request.auth.isAuthenticated,
          searchStr,
          customers: result,
          messages: '',
        });
      } catch (error) {
        console.error(error);
        return h.respsonse('error occured while processing page').status(500);
      } finally {
        await statement.close();
        connectionMap[sid].inUse = false;
      }
    },
  });

  await server.start();
  console.log('Server running at:', server.info.uri);
}


init().catch((error) => {
  console.error(error);
  process.exit(1);
});

// setup interval to clean up connection for expired sessions
setInterval(async () => {
  const current = new Date().getTime();
  // eslint-disable-next-line no-restricted-syntax
  for (const key in connectionMap) {
    // eslint-disable-next-line no-prototype-builtins
    if (connectionMap.hasOwnProperty(key)) {
      const previous = connectionMap[key].timestamp;
      const diff = current - previous;

      if (diff > expiration && !connectionMap[key].inUse) {
        // eslint-disable-next-line no-await-in-loop
        await connectionMap[key].connection.disconn();
        // eslint-disable-next-line no-await-in-loop
        await connectionMap[key].connection.close();
        console.log(`Cleaned up connection: ${key}`);
        delete connectionMap[key];
      }
    }
  }
}, expiration);
