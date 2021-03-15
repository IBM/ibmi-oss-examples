package com.ibm.jesseg;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;

import com.ibm.as400.access.AS400JDBCDataSource;
import java.util.ArrayList;
import java.util.HashMap;
/**
 * A Camel Application that routes messages from an IBM i message queue to
 * email.
 */
public class MainApp {

    private static void pauseContext(final CamelContext _ctx, final long _pauseTime) {
        new Thread((Runnable) () -> {
            _ctx.suspend();
            try {
                Thread.sleep(_pauseTime);
            } catch (Exception e) {
            }
            _ctx.resume();
        }).start();
    }

    public static void main(final String... args) throws Exception {

        // Standard for a Camel deployment. Start by getting a CamelContext object.
        CamelContext context = new DefaultCamelContext();
        System.out.println("Apache Camel version "+context.getVersion());

        context.getRegistry().bind("jt400", new AS400JDBCDataSource("localhost", "*CURRENT", "*CURRENT"));
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from("timer://foo?period=5000").routeId("diskmon")
                    .setBody(constant("SELECT AVG(PERCENT_USED)FROM QSYS2.SYSDISKSTAT A"))
                    .to("jdbc:jt400")
                    .process((exchange) -> {
                            Object diskUsageValue = ((ArrayList<HashMap<String, Object>>)exchange.getIn().getBody()).remove(0).values().iterator().next();
                            exchange.getIn().setBody(diskUsageValue);
                        })
                    .choice()
                        .when(body().isGreaterThan(90))
                            .process((exchange) -> {exchange.getIn().setBody("Average utilization of your disks is "+ exchange.getIn().getBody() + "%");})
                            .to("log:disk_space_mon?showAll=true&level=ERROR")
                            .to("jt400://*CURRENT:*CURRENT@localhost/qsys.lib/QUSRSYS.lib/QSYSOPR.MSGQ?format=binary&guiAvailable=false")
                            .process((exchange) -> { pauseContext(exchange.getContext(), 1000*60*60); })
                        .otherwise()
                            .wireTap("log:disk_space_mon?showAll=true&level=INFO");
            }
        });

        // This actually "starts" the route, so Camel will start monitoring and routing activity here.
        context.start();
        
        while (!context.isStopped()) {
            try {
                Thread.sleep(2000);
            }catch(Exception e) {e.printStackTrace();}
        }
    }
}
