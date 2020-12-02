# Deploying Kafka on IBM i

These steps walk you through installing Kafka 2.6.0 (built with Scala 2.13) and deploying
on an IBM i system using OpenJDK 
[Early Access Builds](https://ibmi-oss-docs.readthedocs.io/en/latest/java11/JAVA11_EARLY_ACCESS.html).

This assumes you are using an SSH terminal and that you have
[your PATH set up properly](https://ibmi-oss-docs.readthedocs.io/en/latest/troubleshooting/SETTING_PATH.html),
for instance:
```
PATH=/QOpenSys/pkgs/bin:$PATH
export PATH
```
and you are hopefully, but optionally, [using bash](https://ibmi-oss-docs.readthedocs.io/en/latest/troubleshooting/SETTING_BASH.html)

Also, note that this deploys with the default "out of the box" settings for Zookeeper
and Kafka. Please refer to the Zookeeper and Kafka documentation to learn about customizing
these appropriately for a production deployment as needed. 

#### 1. Download requisite software
```
yum install wget ca-certificates-mozilla gzip tar-gnu openjdk-11 coreutils-gnu
```

#### 2. Change to your installation directory
```
cd /home/myusr/mydir
```

#### 3. Download kafka
```
wget https://apache.osuosl.org/kafka/2.6.0/kafka_2.13-2.6.0.tgz
```

#### 4. Install maven
```
tar xzvf kafka_2.13-2.6.0.tgz
```

#### 5. Set up environment to use OpenJDK
```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
export JAVA_HOME
PATH=$JAVA_HOME/bin:$PATH
export PATH
```

#### 6. Start a Zookeeper server
```
cd kafka_2.13-2.6.0/config
../bin/zookeeper-server-start.sh zookeeper.properties
```

#### 7. Open a new session and change to your installation directory from earlier
```
cd /home/myusr/mydir
```

#### 8. Start a Kafka server
```
cd kafka_2.13-2.6.0/config
../bin/kafka-server-start.sh server.properties
```

