# Camel Examples

These examples build simple Apache Camel routes from IBM i to other technologies. 

So far, these examples are included:
- msgq_to_email: A route from a message queue to email. That is, any messages sent 
to the given queue will be sent in the body of an email.
- dtaq_to_kafka: A route from a data queue to Apache Kafka. Any entry placed on the
data queue will be sent to a Kafka bootstrap server.

These examples use the following [Apache Camel](https://camel.apache.org/) components:
- [JT400](https://camel.apache.org/components/latest/jt400-component.html)
- [Mail](https://camel.apache.org/components/latest/mail-component.html)
- [Kafka](https://camel.apache.org/components/latest/kafka-component.html)

While these examples use the POJO ("plain old Java object") deployment technique. Apache Camel
can be deployed in a number of ways. Please visit the [Apache Camel home page](https://camel.apache.org/)
to learn more about this technology.

This README documents how to run this example on IBM i, but it can be run from any platform
(assuming Java and maven knowledge).

## How to install prerequisites, configure, and run this example on IBM i

Naturally, the email example requires an SMTP server for sending email. Be sure to have one handy.
Your organization probably already has an SMTP server, and there are several
free (or trial) services available online, including Gmail, or MailJet. You can also run
your own free mail server, like hMailServer.

Similarly, the Kafka example requires you to have a Kafka bootstrap server available.

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
#### 4. Change to the appropriate directory
For instance, if you're starting inside the `ibmi-oss-examples` directory where you cloned this repository:
```
cd camel/msgq_to_email
```
#### 5. Edit the file `src/main/resources/config.properties` with appropriate values
These values are relatively self-explanatory. For the email example, the `smtp.username` and
`smtp.password` lines can be deleted if your SMTP server doesn't require them.

You can also opt to remove any properties from this file, and you will be interactively
prompted for these values. On IBM i, this may require an SSH terminal.

#### 6. Build and launch
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
