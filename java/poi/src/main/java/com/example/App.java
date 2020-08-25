import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Types;

import com.ibm.as400.access.AS400JDBCDriver;
import com.ibm.as400.access.AS400;

import java.util.Properties;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import java.lang.Exception;

import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;


public class App
{
    public static void main( String[] args ) throws Exception
    {
      Properties props = new Properties();
      props.load(new FileInputStream(".env"));

      String HOST = props.getProperty("DB_HOST");
      String USER = props.getProperty("DB_USER");
      String PASS = props.getProperty("DB_PASS");
      String query = "SELECT CUSNUM, LSTNAM, BALDUE, CDTLMT FROM QIWS.QCUSTCDT";

      AS400JDBCDriver driver = new AS400JDBCDriver();
      AS400 as400 = new AS400(HOST, USER, PASS);

      Connection connection = driver.connect(as400);
      Statement statement = connection.createStatement();
      ResultSet results = statement.executeQuery(query);
      ResultSetMetaData metadata = results.getMetaData();

      // create workbook and workshee
      Workbook workbook = WorkbookFactory.create(true);
      Sheet sheet = workbook.createSheet("Customers");

      // add the header
      Row header = sheet.createRow(0);
      int columnCount = metadata.getColumnCount();

      for (int i = 0; i < columnCount; i++) {
        // column name start with index 1
        header.createCell(i).setCellValue(metadata.getColumnName(i + 1));
      }

      // fill in the worksheet
      for (int r = 1; results.next(); r++) {
        Row row = sheet.createRow(r);
        for (int c = 0; c < columnCount; c++) {
          Cell cell = row.createCell(c);
          // column name and type start with index 1
          String columnName = metadata.getColumnName(c + 1);
          int columnType = metadata.getColumnType(c + 1);

          switch (columnType) {
            case Types.NUMERIC:
              row.createCell(c).setCellValue(results.getDouble(columnName));
            break;
            case Types.CHAR:
              row.createCell(c).setCellValue(results.getString(columnName));
            break;
          }
        }
      }

      // write the xlsx file
      workbook.write(new FileOutputStream("Customers.xlsx"));
      System.out.println("Succesfully created Customers.xlsx!");
      connection.close();
      System.exit(0);
    }
}
