const callDb2util = require('./callDb2util');
const config = require('./config')();

config.query = 'SELECT * FROM QIWS.QCUSTCDT';

callDb2util(config, (error, result) => {
    if (error) { throw error; }
    // Output will look like the following:
    // {"records":[
    //   {"CUSNUM":938485,"LSTNAM":"Johnson ","INIT":"J A","STREET":"3 Alpine Way ","CITY":"Helen ","STATE":"GA","ZIPCOD":30545,"CDTLMT":9999,"CHGCOD":2,"BALDUE":3987.50,"CDTDUE":33.50},
    //   ...
    // ]}
    console.log(result);
});
