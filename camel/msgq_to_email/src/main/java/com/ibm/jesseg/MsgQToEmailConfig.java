package com.ibm.jesseg;

import java.io.IOException;

/**
 * For main-line code, see the MainApp class.
 * <br>
 * This is class provides URIs appropriate for establishing Apache 
 * Camel routes for the message queue to email example.
 */
class MsqQToEmailConfig extends CamelConfig {

    /**
     * Get the URI for the SMTP (mail) route
     */
    public String getSmtpUri() throws IOException {
        // something like:
        //    smtp://my.smtp.server.com?from=jgorzins@us.ibm.com&to=jgorzins@us.ibm.com&subject=Camel is Really Amazing!
        String smtpUri = "smtp://"+
               this.getProperty("smtp.server", null, true) +
               "?from=" +
               this.getProperty("smtp.from", null, true) +
               "&to=" +
               this.getProperty("smtp.to", null, true) + 
               "&subject=" + 
               this.getProperty("smtp.subject", null, true);
        String username = this.getProperty("smtp.username", "");
        if(null != username && !username.isEmpty()) {
            smtpUri += ("&username=" + username);
        }
        String password = this.getProperty("smtp.password", "");
        if(null != password && !password.isEmpty()) {
            smtpUri += ("&password=" + password);
        }
        return smtpUri;
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
                "/qsys.lib/" + 
                this.getProperty("jt400.msgq_library", null, true) +
                ".lib/" + 
                this.getProperty("jt400.msgq", null, true) +
                ".msgq?keyed=false&format=binary&guiAvailable=false";
    }
}
