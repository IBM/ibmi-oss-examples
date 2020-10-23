const { Connection, ProgramCall } = require('itoolkit');
const { parseString } = require('xml2js');

// Function using itoolkit/XMLSERVICE that calls the QSYGETPH (get profile
// handle) API to determine if a username/password combination is valid. With
// this function, we can authenticate against IBM i credentials.
async function QSYGETPH(username, password) {
  return new Promise(
    (resolve, reject) => {
      const connection = new Connection({
        transport: 'odbc',
        transportOptions: {dsn: '*LOCAL'}
      });

      const program = new ProgramCall('QSYGETPH', {lib: 'QSYS'});
      program.addParam({
        name: 'user',
        type: '10A',
        io: 'in',
        value: username
      });
      program.addParam({
        name: 'password',
        type: '128A',
        io: 'in',
        value: password
      });
      program.addParam({
        name: 'handle',
        type: '12b',
        io: 'out'
      });

      const errno = {
        name: 'error_code',
        type: 'ds',
        io: 'both',
        len: 'rec2',
        fields: [
          {
            name: 'bytes_provided',
            type: '10i0',
            value: 0,
            setlen: 'rec2',
          },
          {name: 'bytes_available', type: '10i0', value: 0},
          {name: 'msgid', type: '7A', value: ''},
          {type: '1A', value: ''},
        ],
      };
      program.addParam(errno);

      program.addParam({
        name: 'password_length',
        type: '10i0',
        io: 'in',
        value: password.length
      });

      program.addParam({
        name: 'ccsid',
        type: '10i0',
        io: 'in',
        value: 37
      });

      connection.add(program);
      connection.run((error, xmlOutput) => {
        if (error) {
          reject(error);
        }
        parseString(xmlOutput, (parseError, result) => {
          if (parseError) {
            reject(parseError);
          }

          if (result.myscript.pgm[0].parm[1].ds[0].data[1]._ === "0") {
            resolve(username);
          } else {
            reject(result.myscript.pgm[0].parm[1].ds[0].data[2]._);
          }
        });
      });
    }
  )
};

exports.QSYGETPH = QSYGETPH;
