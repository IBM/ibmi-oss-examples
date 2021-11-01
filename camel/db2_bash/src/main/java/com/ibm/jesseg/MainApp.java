package com.ibm.jesseg;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.component.jt400.Jt400Endpoint;
import java.util.ArrayList;
import java.util.List;
import org.apache.camel.component.exec.ExecBinding;

/**
 * A Camel Application that routes messages from an IBM i message queue to email.
 */
public class MainApp { 
    public static void main(final String... args) throws Exception {
        // Standard for a Camel deployment. Start by getting a CamelContext object.
        CamelContext context = new DefaultCamelContext();
        System.out.println("Apache Camel version "+context.getVersion());
        
        final String dtaqUriRead =  "jt400://*CURRENT:*CURRENT@localhost/qsys.lib/coolstuff.lib/bashq.DTAQ?format=binary&keyed=true&searchKey=&readTimeout=-1&searchType=NE";
        final String dtaqUriWrite = "jt400://*CURRENT:*CURRENT@localhost/qsys.lib/coolstuff.lib/bashq2.DTAQ?format=binary&keyed=true";

        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from("direct:bash")
                .process( (exchange) -> {
                    java.util.List<String> args = new ArrayList<String>(3);
                    args.add("-c");
                    args.add(exchange.getIn().getBody(String.class)+" 2>&1");
                    exchange.getIn().setHeader(ExecBinding.EXEC_COMMAND_ARGS, args);
                })
                .to("exec:///QOpenSys/pkgs/bin/bash")
                .convertBodyTo(String.class)
                ;
            }
        });
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() {
                from(dtaqUriRead)
                .process( (exchange) -> {
                    Object hdr = exchange.getIn().getHeader(Jt400Endpoint.KEY);
                    exchange.getIn().setHeader("DQFUNC", new String((byte[])hdr, "Cp037").replaceAll(":.*$",""));
                })
                .wireTap("log:db2_bash?showAll=true&level=INFO")
                .to("direct:bash")
                .to(dtaqUriWrite);
            }
        });

        // This actually "starts" the route, so Camel will start monitoring and routing activity here.
        context.start();

        // Since this program is designed to just run forever (until user cancel), we can just sleep the
        // main thread. Camel's work will happen in secondary threads.
        Thread.sleep(Long.MAX_VALUE);
        context.stop();
        context.close();
    }
}

