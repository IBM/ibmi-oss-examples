# Camel Examples

These examples build simple Apache Camel routes from IBM i to other technologies. 

So far, these examples are included:
- msgq_to_email: A route from a message queue to email. That is, any messages sent 
to the given queue will be sent in the body of an email.
- dtaq_to_kafka: A route from a data queue to Apache Kafka. Any entry placed on the
data queue will be sent to a Kafka bootstrap server. For an example of how this might
be leveraged with database capabilities, please see
[dtaq_to_kafka/banking_kafka_example.sql](dtaq_to_kafka/banking_kafka_example.sql),
which demonstrates how a bank might use this technology to publish changes to
a customer database to a Kafka topic.

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

Similarly, the Kafka example requires you to have a Kafka bootstrap server available. If
you would like to deploy Kafka on your IBM i system, see [this documentation](dtaq_to_kafka/KAFKA_DEPLOY.md)
for guidance, but of course you may deploy your bootstrap server wherever it makes the
most sense. Some deploy on a local laptop for bringup/testing. 

#### 1. Install OpenJDK. 
```
yum install openjdk-11
PATH=/QOpenSys/pkgs/lib/jvm/openjdk-11/bin:$PATH
export PATH
```

#### 2. Set the `JAVA_HOME` environment variable to the JRE of your choosing
If using OpenJDK:
```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
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
prompted for these values. On IBM i, this may require an SSH terminal. Note that the
`*CURRENT` special value cannot be used with OpenJDK.

#### 6. Build and launch
```
mvn install
mvn exec:java
```
The program will continue running until canceled.
Test by sending a message to the queue!

Since the `config.properties` file contains passwords, you may want to stash a copy
in a secure location. If you want to do this, just set the `camelconfig` Java System
property to the path of the file. For example:
```
mvn install
mvn exec:java -Dcamelconfig=/home/MYUSER/.private/config.properties
```
Or, for interactive use, simply remove the properties from the `config.properties`
file and let the program prompt you.

## Understanding the code and learning more

To learn how to use Apache Camel, it would be good to start with the
[Apache Camel user manual](https://camel.apache.org/manual/latest/index.html),
and in particular [this walkthrough of a simple example](https://camel.apache.org/manual/latest/walk-through-an-example.html).

Currently, these examples don't demonstrate the more powerful capabilities of Camel.
Future enhancements might demostrate the implementation of [Enterprise Integration Patterns](https://camel.apache.org/components/latest/eips/enterprise-integration-patterns.html).

However, the base functionality of camel is based on the notion of routes. In fact, [the Camel documentation on routes](https://camel.apache.org/manual/latest/routes.html)
is the best resource for extending and customizing one of these simple examples to suit your needs!

That being said, most of the code in these examples is built to create a user-friendly
way to create URIs driven by user interaction and a configuration file. 
All the actual work is done simply by using the proper URIs to define a route.
This is shown in the few lines of Java pseudocode below!

```java
final String sourceUri = // some URI of an endpoint that produces data
final String targetUri = // some URI of an endpoint to receive data
context.addRoutes(new RouteBuilder() {
    @Override
    public void configure() {
        from(sourceUri)
        .to(targetUri); 
    }
});
```
As you can see, route definitions are defined by implementation of a `RouteBuilder` object.
If you're a hands-on learner, go straight to [the Javadoc](https://www.javadoc.io/doc/org.apache.camel/camel-core/3.0.0-RC1/org/apache/camel/builder/RouteBuilder.html)
for this class! Its `configure()` method is called on initialization, and the `from()`
method creates a `RouteDefinition` object. The `RouteDefinition` object can then be tied
to choices, custom processing, or in this case, a simple endpoint.
