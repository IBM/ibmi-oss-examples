const odbc = require('odbc');
const {Connection, CommandCall, ProgramCall} = require('itoolkit');
const {parseString} = require('xml2js');

// cb format: err, result
function runSql(conn, sql, cb) {
    try {
        console.log('Running sql ' + sql);
        conn.query(sql, function(error, results) {
            if (error) cb(error, null);
            else cb(null, results);
        });
    } catch (err) {
        console.log(`Error ${error} from running sql query ${sql}`);
    }
}

let ibmi = (function() {
    let module = {};

    // creates a user object that includes an open connection to specified ibmi
    // server
    // cb format: err, user
    module.processUserSignIn = function(username, password, server, cb) {
        odbc.connect(`DSN=${server};UID=${username};PWD=${password}`, function(err, conn) {
            if (err) {
                console.log(`=> ODBC connection fail(username=${username}, server=${server}): ${err}`);
                cb(err, null);
            } else {
                console.log(`=> ODBC connection success(username=${username}, server=${server})`);
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
