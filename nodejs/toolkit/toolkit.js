const { Connection, CommandCall } = require('itoolkit');
const { parseString } = require('xml2js');
const config = require('./config')();

const connection = new Connection({
  transport: 'ssh',
  transportOptions: config,
});

const command = new CommandCall({ type: 'cl', command: 'RTVJOBA USRLIBL(?) SYSLIBL(?)' });

connection.add(command);

connection.run((error, xmlOutput) => {
  if (error) {
    throw error;
  }
  parseString(xmlOutput, (parseError, result) => {
    if (parseError) {
      throw parseError;
    }
    console.log(JSON.stringify(result));
  });
});
