const fs = require('fs');
const ini = require('ini');

module.exports = function getConfiguredServers(options = {}) {
  const { file = './.odbc.ini', tunneling = false } = options;
  let servers = [];
  try {
    const config = ini.parse(fs.readFileSync(file, 'utf-8'));
    servers = config;
    if (tunneling) {
      const dsns = Object.keys(config);
      let found = false;
      // check if dsn with system local host exists
      for (let i = 0; i < dsns.length; i += 1) {
        if (config[dsns[i]].System === '127.0.0.1') {
          found = true;
          break;
        }
      }
      if (!found) {
        // create an entry for localhost tunnel
        config.tunnel = {};
        config.tunnel.System = '127.0.0.1';
        fs.writeFileSync('./.odbc.ini', ini.stringify(servers));
      }
    }
    // eslint-disable-next-line indent
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`${file} was not found!`);
    } else {
      throw error;
    }
  } finally {
    return servers;
  }
};
