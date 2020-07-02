# Camel Example (Message Queue to Email)

This example builds a simple Apache Camel route from an IBM i
message queue to email. That is, any messages sent to the given queue
will be sent in the body of an email. 

## To run this example:

### Installlation
1. Install a Java runtime. 
Option 1: openjdk (cannot use the `*CURRENT` special value for jt400 authentication)
```
yum install openjdk-11
PATH=/QOpenSys/pkgs/lib/jvm/openjdk-11/bin:$PATH
export PATH
```
Option 2: Install 5770JV1 option 17 (this is likely already installed)

2. Set the `JAVA_HOME` environment variable to the JRE of your choosing
If using openjdk:
```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
export JAVA_HOME
```
If using 5770JV1
```
JAVA_HOME=/QOpenSys/QIBM/ProdData/JavaVM/jdk80/64bit
export JAVA_HOME
```

3. Install maven
```
yum install maven
```

4. Edit the file `src/main/resources/config.properties` with appropriate values
These values are relatively self-explanatory. You will need IBM i login credentials
as well as an SMTP server to use for sending emails. 

5. Build and launch
```
mvn install && mvn exec:java
```


