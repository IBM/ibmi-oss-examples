package com.ibm.jesseg;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.component.jt400.Jt400Constants;
/**
 * A Camel Application that routes messages from an IBM i message queue to email.
 */
public class MainApp { 
    public static void main(final String... args) throws Exception {

        // This class simply reads values and creates URIs from the config.properties file.
        // This is not a standard Camel class, but is part of this example. You can feel free
        // to just write the URIs instead of using this class.
        MyCamelConfig conf = new MyCamelConfig();

        // Standard for a Camel deployment. Start by getting a CamelContext object.
        CamelContext context = new DefaultCamelContext();
        System.out.println("Apache Camel version "+context.getVersion());

        for(final String host : conf.getProperty("jt400.hosts", null,true).split(",")){
            final String slackUri = conf.getSlackUri();
            final String msgqUri = conf.getMsgQUri(host);
            System.out.println("Reading from "+msgqUri);
            context.addRoutes(new RouteBuilder() {
                @Override
                public void configure() {
                    from(msgqUri).wireTap("log:msgq_received?showAll=true&level=INFO")
                    .choice()
                        .when(header(Jt400Constants.MESSAGE_SEVERITY).isGreaterThan(45))     
                            .setBody(simple("*SYSOPR on system "+host+" received message ${header.CamelJt400MessageID}: ${body}"))
                            .wireTap("log:message_to_slack?showAll=true&level=INFO") // This is just for debug data flowing through the route
                            .to(slackUri); 
                }
            });
        }

        // This actually "starts" the route, so Camel will start monitoring and routing activity here.
        context.start();

        // Since this program is designed to just run forever (until user cancel), we can just sleep the
        // main thread. Camel's work will happen in secondary threads.
        Thread.sleep(Long.MAX_VALUE);
        context.stop();
        context.close();
    }
}

