// Need change based on your server configurations
const database = process.env.TKDB || '*LOCAL';
const user = process.env.TKUSER || '*NONE';
const password = process.env.TKPASS || '*NONE';
const host = process.env.TKHOST || '127.0.0.1';
const port = process.env.TKPORT || 80;
const path = process.env.TKPATH || '/cgi-bin/xmlcgi.pgm';
const ipc = '*na';
const ctl = '*here';
const demoLib1 = 'FLGHT400';
const demoLib2 = 'FLGHT400M';

module.exports = {
  database, user, password, host, port, path, ipc, ctl, demoLib1, demoLib2,
};
