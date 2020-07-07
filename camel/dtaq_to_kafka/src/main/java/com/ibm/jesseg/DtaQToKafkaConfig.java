package com.ibm.jesseg;

import java.io.IOException;

/**
 * For main-line code, see the MainApp class.
 * <br>
 * This is class provides URIs appropriate for establishing Apache 
 * Camel routes for this example.
 */
class DtaQToKafkaConfig extends CamelConfig {

    /**
     * Get the URI for the SMTP (mail) route
     */
    public String getKafkaUri() throws IOException {
        // something like:
        //    kafka:mytopic?brokers=mybroker:9092
        return "kafka:" +
            this.getProperty("kafka.topic") +
            "?brokers=" +
            this.getProperty("kafka.broker") + ":" + this.getProperty("kafka.broker.port","9092");
    }

    /**
     * Get the URI for the IBM i message queue route
     */
    public String getDtaQUri() throws IOException {
        // something like:
        //    jt400://username:password@localhost/qsys.lib/mylib.lib/myq.DTAQ?keyed=false&format=binary&guiAvailable=false
        return "jt400://" +
                this.getProperty("jt400.username") +
                ":" + 
                this.getProperty("jt400.password") +
                "@" +
                this.getProperty("jt400.host", "localhost") + 
                "/qsys.lib/" + 
                this.getProperty("jt400.dtaq_library", null, true) +
                ".lib/" + 
                this.getProperty("jt400.dtaq", null, true) +
                ".dtaq?keyed=false&format=binary&guiAvailable=false";
    }
}
