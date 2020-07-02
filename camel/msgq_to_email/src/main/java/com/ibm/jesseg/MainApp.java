package com.ibm.jesseg;

import java.lang.System;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;

/**
 * A Camel Application
 */
public class MainApp { 
    public static void main(String... args) throws Exception {
        CamelConfig conf = new CamelConfig();
        CamelContext context = new DefaultCamelContext();
        System.out.println("Apache Camel version "+context.getVersion());
        
        final String msgqUri = conf.getMsgQUri(); //something like -> jt400://username:password@localhost/qsys.lib/mylib.lib/myq.DTAQ?keyed=false&format=binary&guiAvailable=false
        final String smtpUri = conf.getSmtpUri(); //something like -> smtp://my.smtp.server.com?from=jgorzins@us.ibm.com&to=jgorzins@us.ibm.com&subject=Camel is Really Amazing!
        context.addRoutes(new RouteBuilder() {
            public void configure() {
                from(msgqUri) 
                .wireTap("log:kafka_camel?showAll=true&level=INFO")
                .to(smtpUri); 
            }
        });
        context.start();
        Thread.sleep(Long.MAX_VALUE);
        context.stop();
        context.close();
    }
}

