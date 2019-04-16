const database = process.env.TKDB || '*LOCAL';
const user = process.env.TKUSER || '*NONE';
const password = process.env.TKPASS || '*NONE';
const host = process.env.TKHOST || '127.0.0.1';
const port = process.env.TKPORT || 80;
const path = process.env.TKPATH || '/cgi-bin/xmlcgi.pgm';
const ipc = '*na';
const ctl = '*here';
const demoLib = 'HATS';
const demoAsset = '/silly_public/images/';

module.exports = {
  database, user, password, host, port, path, ipc, ctl, demoLib, demoAsset,
};
