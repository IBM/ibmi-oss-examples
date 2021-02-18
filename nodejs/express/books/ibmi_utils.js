const odbc = require('odbc');
const itoolkit = require('itoolkit');

let ibmi = (function() {
    let module = {};

    module.qwe = function() {
        console.log('qwe');
    };

    module.processUserSignIn = function(username, password, server) {
        // returns user object; username is primary key; conn is open connection to
        // ibmi server
        return {
            username: username,
            password: password,
            server: server,
            connection: null
        };
    };

    return module;
})();

module.exports = ibmi;
