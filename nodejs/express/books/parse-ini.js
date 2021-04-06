const fs = require('fs');
const ini = require('ini');

module.exports = function getConfiguredServers(file = './.odbc.ini') {
  let servers = [];
  try {
    console.log('ini to parse: ', file);
    const config = ini.parse(fs.readFileSync(file, 'utf-8'));
    servers = config;
  } catch (error) {
    console.log('got me an error: ', error);
    if (error.code === 'ENOENT') {
      console.log(`${file} was not found!`);
    } else {
      throw error;
    }
  } finally {
    return servers;
  }
};
