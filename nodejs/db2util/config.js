require('dotenv').config();

function getConfig() {
    let config = {};

    if (!process.env.SSH_USER) {
        throw Error('"SSH_USER" environment variable must be defined');
    }

    config.username = process.env.SSH_USER;

    if (process.env.SSH_HOST) {
        config.host = process.env.SSH_HOST;
    }

    if (process.env.SSH_PASSWORD) { // password auth
      config.password = process.env.SSH_PASSWORD;
    } else if (process.env.SSH_PRIVATE_KEY) { // using private key auth
      config.privateKey = SSH_PRIVATE_KEY
    }

   return config;
}

module.exports = getConfig;
