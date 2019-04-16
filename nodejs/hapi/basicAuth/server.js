const {
  Connection, IN, CHAR,
} = require('idb-pconnector');

const Hapi = require('hapi');
const basicAuth = require('hapi-auth-basic');

const port = process.env.PORT || 4000;
const verbose = process.env.DEBUG;

// DOC: https://hapijs.com/tutorials/auth?lang=en_US
async function validate(request, username, password) {
  try {
    const connection = new Connection({ url: '*LOCAL', username, password });
    request.dbconnection = connection;
  } catch (error) {
    return { credentials: null, isValid: false };
  }

  return { isValid: true, credentials: { username } };
}

async function clean(connection) {
  await connection.disconn();
  await connection.close();
  // eslint-disable-next-line no-param-reassign
  connection = null;
}

const main = async () => {
  const server = Hapi.server({ port });

  await server.register(basicAuth);

  server.auth.strategy('simple', 'basic', { validate });
  server.auth.default('simple');

  server.route({
    method: 'GET',
    path: '/customer/{number}',
    async handler(request, h) {
      request.log('route', `${request.method} ${request.path}`);
      request.log('user input', request.params);

      const statement = request.dbconnection.getStatement();

      try {
        await statement.prepare('SELECT CUSNUM, LSTNAM, INIT, STREET, CITY, STATE FROM QIWS.QCUSTCDT WHERE CUSNUM = ?');
        await statement.bindParam([[request.params.number, IN, CHAR]]);
        await statement.execute();
        const result = await statement.fetchAll();

        if (!result) {
          await clean(request.dbconnection);
          return h.response({ message: 'invalid customer number' }).code(404);
        }

        request.log('output', result[0]);
        return result[0];
      } catch (error) {
        request.log('error', error);
        return h.response({ message: 'unable to process your query' }).code(404);
      } finally {
        await clean(request.dbconnection);
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/customer',
    async handler(request, h) {
      if (request.mime !== 'application/json' || !request.payload) {
        await clean(request.dbconnection);
        return h.response({ message: 'expected JSON input' }).code(404);
      }

      request.log('route', `${request.method} ${request.path}`);
      request.log('user input', request.payload);

      const statement = request.dbconnection.getStatement();

      try {
        const sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM, LSTNAM, INIT, STREET, CITY, STATE) VALUES (?,?,?,?,?,?) with NONE';

        const params = [[request.payload.cusnum, IN, CHAR], [request.payload.lstnam, IN, CHAR],
          [request.payload.init, IN, CHAR], [request.payload.street, IN, CHAR],
          [request.payload.city, IN, CHAR], [request.payload.state, IN, CHAR],
        ];

        await statement.prepare(sql);
        await statement.bindParam(params);
        await statement.execute();

        return { message: 'Successfully added customer' };
      } catch (error) {
        request.log('error', error);
        return h.response({ message: 'unable to process your query' }).code(404);
      } finally {
        await clean(request.dbconnection);
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/customer',
    async handler(request, h) {
      if (request.mime !== 'application/json' || !request.payload) {
        await clean(request.dbconnection);
        return h.response({ message: 'expected JSON input' }).code(404);
      }

      if (!request.payload.cusnum) {
        await clean(request.dbconnection);
        return h.response({ message: 'cusnum is a required parameter' }).code(404);
      }

      request.log('route', `${request.method} ${request.path}`);
      request.log('user input', request.payload);

      const fields = ['cusnum', 'lstnam', 'init', 'street', 'city', 'state'];
      const updateFields = {};

      // filter out the fields we need to
      Object.keys(request.payload).forEach((key) => {
        if (fields.includes(key)) {
          updateFields[key] = request.payload[key];
        }
      });

      if (!Object.keys(updateFields).length) {
        await clean();
        return { message: 'nothing to update' };
      }

      // generate the UPDATE SQL
      let sql = 'UPDATE QIWS.QCUSTCDT SET ';

      Object.keys(updateFields).forEach((key, index, array) => {
        if (key !== 'cusnum') {
          sql += `${key.toUpperCase()} = ? `;

          if (index !== array.length - 1) {
            sql += ', ';
          }
        }
      });

      sql += 'WHERE CUSNUM = ? with NONE';
      request.log('generated sql', sql);

      const params = Object.values(updateFields);

      // move the value of cusnum to the end of the array
      params.push(params.splice(params.indexOf(request.payload.cusnum), 1)[0]);
      request.log('params', params);

      // format the parameters to the expected layout
      for (let i = 0; i < params.length; i += 1) {
        params[i] = [params[i], IN, CHAR];
      }

      request.log('params', params);

      const statement = request.dbconnection.getStatement();

      try {
        await statement.prepare(sql);
        await statement.bindParam(params);
        await statement.execute();
        return { message: 'Successfully updated customer' };
      } catch (error) {
        request.log('error', error);
        return h.response({ message: 'unable to process your query' }).code(404);
      } finally {
        await clean(request.dbconnection);
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/customer/{number}',
    async handler(request, h) {
      request.log('route', `${request.method} ${request.path}`);
      request.log('user input', request.params);

      const statement = request.dbconnection.getStatement();

      try {
        await statement.prepare('DELETE FROM QIWS.QCUSTCDT WHERE CUSNUM = ? with NONE');
        await statement.bindParam([[request.params.number, IN, CHAR]]);
        await statement.execute();

        return { message: 'Successfully deleted customer' };
      } catch (error) {
        request.log('error', error);
        return h.response({ message: 'unable to process your query' }).code(404);
      } finally {
        await clean(request.dbconnection);
      }
    },
  });

  // DOC: https://hapijs.com/api#-request-event
  server.events.on('request', (request, event, tags) => {
    if (verbose) {
      if (tags.error) {
        console.error(event.error);
      } else {
        console.log(`${event.tags[0]}: `, event.data);
      }
      console.log('\n');
    }
  });

  await server.start();

  return server;
};

main()
  .then(server => console.log(`Server listening on ${server.info.uri}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
