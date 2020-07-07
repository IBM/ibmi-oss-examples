# Camel Example

This example builds a simple Apache Camel route from an IBM i
message queue to email. That is, any messages sent to the given queue
will be sent in the body of an email.

This example uses the [JT400](https://camel.apache.org/components/latest/jt400-component.html)
and [Mail](https://camel.apache.org/components/latest/mail-component.html) components
of [Apache Camel](https://camel.apache.org/), and uses the POJO ("plain old Java
object") deployment technique. Apache Camel is the "swiss knife" of integration,
and can be deployed in a number of ways. Please visit the [Apache Camel home page](https://camel.apache.org/)
to learn more about this technology.

This README documents how to run this example on IBM i, but it can be run from any platform
(assuming Java and maven knowledge).

## How to install prerequisites, configure, and run this example on IBM i

This example requires an SMTP server for sending email. Be sure to have one handy.
Your organization probably already has an SMTP server, and there are several
free (or trial) services available online, including Gmail, or MailJet. You can also run
your own free mail server, like hMailServer.

#### 1. Install a Java runtime. 

Option 1: openjdk (cannot use the `*CURRENT` special value for jt400 authentication)
```
yum install openjdk-11
PATH=/QOpenSys/pkgs/lib/jvm/openjdk-11/bin:$PATH
export PATH
```
Option 2: Install 5770JV1 option 17 (this is likely already installed)

#### 2. Set the `JAVA_HOME` environment variable to the JRE of your choosing
If using openjdk:
```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
export JAVA_HOME
```
If using 5770JV1:
```
JAVA_HOME=/QOpenSys/QIBM/ProdData/JavaVM/jdk80/64bit
export JAVA_HOME
```

#### 3. Install maven
```
yum install maven
```
#### 4. Edit the file `src/main/resources/config.properties` with appropriate values
These values are relatively self-explanatory. You will need IBM i login credentials
as well as an SMTP server to use for sending emails. The `smtp.username` and
`smtp.password` lines can be deleted if your SMTP server doesn't require them.

You can also opt to remove any properties from this file, and you will be interactively
prompted for these values. On IBM i, this may require an SSH terminal.

#### 5. Build and launch
```
mvn install && mvn exec:java
```
The program will continue running until canceled.
Test by sending a message to the queue!

Since the `config.properties` file contains passwords, you may want to stash a copy
in a secure location. If you want to do this, just set the `camelconfig` Java System
property to the path of the file. For example:
```
mvn install && mvn exec:java -Dcamelconfig=/home/MYUSER/.private/config.properties
```
Or, for interactive use, simply remove the properties from the `config.properties`
file and let the program prompt you.
