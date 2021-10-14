package com.ibm.jesseg;

import java.io.IOException;
import java.net.URLEncoder;

/**
 * For main-line code, see the MainApp class.
 * <br>
 * This is class provides URIs appropriate for establishing Apache 
 * Camel routes for the message queue to email example.
 */
class MyCamelConfig extends CamelConfig {

    /**
     * Get the URI for the SMTP (mail) route
     */
    public String getSlackUri() throws IOException {
        String slackUri = "slack:#"+
                this.getProperty("slack.channel", null, true) +
               "?webhookUrl=" +
            this.getProperty("slack.webhook", null, true);
        return slackUri;
    }

    /**
     * Get the URI for the IBM i message queue route
     */
    public String getMsgQUri() throws IOException {
        // something like:
        //    jt400://username:password@localhost/qsys.lib/mylib.lib/myq.MSGQ?format=binary&guiAvailable=false
        return "jt400://" +
                this.getProperty("jt400.username") +
                ":" + 
                this.getProperty("jt400.password") +
                "@" +
                this.getProperty("jt400.host", "localhost") +
                this.getProperty("jt400.msgq", null, true) +
                "?guiAvailable=false&messageAction=OLD";
    }
    /**
     * Get the URI for the IBM i message queue route on a specific host
     */
    public String getMsgQUri(final String _host) throws IOException {
        // something like:
        //    jt400://username:password@localhost/qsys.lib/mylib.lib/myq.MSGQ?format=binary&guiAvailable=false
        return "jt400://" +
                this.getProperty("jt400.username") +
                ":" + 
                this.getProperty("jt400.password") +
                "@" +
                _host +
                this.getProperty("jt400.msgq", null, true) +
                "?guiAvailable=false";
    }
}
