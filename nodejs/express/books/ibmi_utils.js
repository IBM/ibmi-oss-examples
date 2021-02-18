const odbc = require('odbc');
const {Connection, CommandCall, ProgramCall} = require('itoolkit');

let ibmi = (function() {
    let module = {};

    // cb format: err, result
    module.testConnection = function(user, cb) {};

    // creates a user object that includes an open connection to specified ibmi
    // server
    // cb format: err, user
    module.processUserSignIn = function(username, password, server, cb) {
        odbc.connect(`DSN=${server};UID=${username};PWD=${password}`, function(err, conn) {
            if (err) {
                console.log(`=> ODBC connection failed(username=${username}): ${err}`);
                cb(err, null);
            } else {
                console.log(`=> ODBC connection succeeded(username=${username}): ${JSON.stringify(conn)}`);
                // pass user to callback
                let user = {
                    username: username,
                    password: password,
                    server: server,
                    conn: conn
                };
                cb(null, user);
            }
        });
    };

    return module;
})();

module.exports = ibmi;
