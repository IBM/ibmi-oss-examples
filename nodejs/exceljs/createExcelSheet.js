const odbc = require('odbc');
const Excel = require('exceljs');
const connectionString = require('./getConnectionString')();

async function createExcelSheet() {
  const connection = await odbc.connect(connectionString);
  const query = 'SELECT CUSNUM, LSTNAM, BALDUE, CDTLMT FROM QIWS.QCUSTCDT';
  const resultSet = await connection.query(query);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Customers');

  worksheet.columns = [
    { header: 'id', key: 'CUSNUM' },
    { header: 'Last Name', key: 'LSTNAM' },
    { header: 'Balance Due', key: 'BALDUE' },
    { header: 'Credit Limit', key: 'CDTLMT' },
  ]

  for (const row of resultSet) {
    worksheet.addRow(row);
  }

  await workbook.xlsx.writeFile('Customers.xlsx');
}

createExcelSheet().catch((error) => {
  console.warn('Failed to create the excel worksheet');
  console.error(error);
});
