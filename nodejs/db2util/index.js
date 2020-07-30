const callDb2util = require('./callDb2util');
const config = require('./config')();

config.query = 'SELECT * FROM QIWS.QCUSTCDT';

callDb2util(config, (error, result) => {
    if (error) { throw error; }
    console.log(result);
});
