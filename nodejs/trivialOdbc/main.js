const odbc = require('odbc');

async function test() {
  try {
    const connection = await odbc.connect('DSN=LUGDEMO');
    const result = await connection.query('SELECT * FROM QIWS.QCUSTCDT');
    console.log(result);
    await connection.close();
  } catch (e) {
    console.error(e);
  }
}

test();

