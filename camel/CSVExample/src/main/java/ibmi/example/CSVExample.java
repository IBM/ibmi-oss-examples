package ibmi.example;

/** 
 * Standard imported libraries
 */
import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.dataformat.csv.CsvDataFormat;
import org.apache.commons.csv.QuoteMode;

/** 
 * IBM i specific imported libraries for connecting to the DB2 database
 */
import com.ibm.as400.access.AS400JDBCDataSource;

/**
 * This is a CSV example for creating a CSV from a query and doing different operations with it as a result
 */
public class CSVExample {

    public static void main(final String... args) throws Exception {

        /**
         * Values for configuring application. Setting constants at the top of the app for configuration 
         * and then using variables within the app allow you to configure your app for multiple situations
         * without having to dig through code and make changes within the code. 
         * 
         * Options are:
         * standardcsvexample - Just creating a standard CSV, no options
         * pipedelimitedexample - Creating a pipe deliminited example and removing double quotes from strings
         * displayindividualfieldoutput - Selecting just the first row from the query results, and outputting
         * to the screen, no file written
         * 
         */
        final String whatexample = args.length > 0 ? args[0].trim() : "standardcsvexample";

        /**
         * This is the location we want our file stored in after it is created. Note that you can start from 
         * root with a leading forward slash, or a subdirectory of where the program is called like the example
         * below
         */
        final String filelocation = "./tmp/";


        /**
         * Standard for a Camel deployment. Start by getting a CamelContext object.
         */
        final CamelContext context = new DefaultCamelContext();

        /**
         * This sets up the connection for local IBM i Here is where we will store
         * connection information for the application
         */
        AS400JDBCDataSource localDS = new AS400JDBCDataSource("localhost", "*CURRENT", "*CURRENT");

        /**
         * These values below exist if you are not journaling your IBM i table that you are querying
         */
        //localDS.setTransactionIsolation("none");
        
        /**
         * This binds the localDS we set above to the route jt400
         */
        context.getRegistry().bind("jt400", localDS);

        /**
         * Setting our Marshall options for CSV
         */
		

        /**
         * What example do we want to accomplish? Set the variable above to choose the example 
         */
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from("timer://ibmiexamplecheckinterval?repeatCount=1")
                        /**
                         * This is our example query. Here we are pulling results from the system.
                         * You set the body of our program (which is a mutable object used to contain the results throughout).
                         * Here I have set it to a constant, but you can use the simple() function to set some dynamic values
                         * if needed in your own example. Once you have set the body, you send to JT400. The results are then 
                         * stored in our body, replacing the query we set it to before.  
                         */
                          .setBody(constant("select * from QSYS2.NETSTAT_INFO"))
                          .to("jdbc:jt400")
                        /**
                         * Now we have queried some results! We want to send it to a CSV for output. 
                         */                
                        .to("direct:" + whatexample)
                        .process((exchange) -> {new Thread(() -> { context.stop();}).start();});
            }
        });

        /**
         * This will do a standard output of values to CSV
         */
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                // The from should match our to in the calling route. This connects our two routes
                from("direct:standardcsvexample")
                // Marshall is how we are going to divide up each result from the row and what to do
                .marshal()
                // This creates our CSV from the results that were marshalled
                .csv()
                // This specific header we are setting is the name of our file
                .setHeader("CamelFileName", constant("CSVExample.csv"))
                // This is where we are storing the file. This is set at the top by constants
            	.to("file:" + filelocation);
            }
        });
        final CsvDataFormat csvPipeDelimited = new CsvDataFormat();
        csvPipeDelimited.setQuoteMode(QuoteMode.NONE);
        csvPipeDelimited.setEscape('\\');
        csvPipeDelimited.setDelimiter('|');
        /**
         * This will show how to adjust the pipe delimiter
         */
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from("direct:pipedelimitedexample")
                .marshal(csvPipeDelimited)
                .setHeader("CamelFileName", constant("CSVPipeDelimtedExample.csv"))
                .to("file:" + filelocation);
            }
        });
      
        /**
         * This is an example of how to take individual values from the first row of our query, 
         * set them to a header (where we tend to store individual values throughout our app),
         * and output those values to the screen. 
         */
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from("direct:displayindividualfieldoutput")
                // This will take our multiple rows of results, split them up, and give us the ability to acces them one by one
                // If there are no results from the query, the application will just stop
                .split(body())
                // Here we set the header of two values from our results. Notice we use the simple() function
                // To access values from our query ${body[COLUMN_HEADER]}
                .setHeader("localportname", simple("${body[LOCAL_PORT_NAME]}"))
                .setHeader("RoundTripVariance", simple("${body[ROUND_TRIP_VARIANCE]}"))
                // Now we will run a process to print the values out to the screen for each row
                .process((exchange) -> {
                    System.out.println("Local Port Name: " + exchange.getIn().getHeader("localportname"));
                    System.out.println("Round Trip Variance: " + exchange.getIn().getHeader("RoundTripVariance"));
                });
            }
        });
      
        
        /**
         * This actually "starts" the route, so Camel will start monitoring and routing
         * activity here.
         */
        context.start();

        /**
         * This runs the check every 5 seconds if it is stopped
         */
        while (!context.isStopped()) {
            try {
                Thread.sleep(5000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

}
