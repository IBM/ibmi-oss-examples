import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.DriverManager;

import com.ibm.as400.access.AS400JDBCDriver;

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

      String URL = "jdbc:as400://" + props.getProperty("DB_HOST");
      String USER = props.getProperty("DB_USER");
      String PASS = props.getProperty("DB_PASS");
      String query = "SELECT CUSNUM, LSTNAM, BALDUE, CDTLMT FROM QIWS.QCUSTCDT";
      int numColms = 4;

      Class.forName("com.ibm.as400.access.AS400JDBCDriver");

      System.out.println("Trying to connect...");
      Connection connection = DriverManager.getConnection(URL, USER, PASS);
      Statement statement = connection.createStatement();
      ResultSet results = statement.executeQuery(query);
      // create excel sheets
      Workbook workbook = WorkbookFactory.create(true);
      Sheet sheet = workbook.createSheet("Sheet1");

      // Add the header
      Row header = sheet.createRow(0);
      header.createCell(0).setCellValue("CUSNUM");
      header.createCell(1).setCellValue("LSTNAM");
      header.createCell(2).setCellValue("BALDUE");
      header.createCell(3).setCellValue("CDTLMT");

      // fill in the cells
      for (int r = 1; results.next(); r++) {
        Row row = sheet.createRow(r);
        for (int c = 0; c < numColms; c++) {
          Cell cell = row.createCell(c);
          switch(c) {
              case 0:
                cell.setCellValue(results.getDouble("CUSNUM"));
              break;
              case 1:
                cell.setCellValue(results.getString("LSTNAM"));
              break;
              case 2:
                cell.setCellValue(results.getDouble("BALDUE"));
              break;
              case 3:
                cell.setCellValue(results.getDouble("CDTLMT"));
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
