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
yum install wget ca-certificates-mozilla gzip tar-gnu openjdk-11 coreutils-gnu sed-gnu grep-gnu
```

#### 2. Change to your installation directory
```
cd /home/myusr/mydir
```

#### 3. Download kafka
```
wget https://apache.osuosl.org/kafka/2.6.0/kafka_2.13-2.6.0.tgz
```

#### 4. extract Kafka
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

#### 8. Set up environment to use OpenJDK and start a Kafka server
```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
export JAVA_HOME
PATH=$JAVA_HOME/bin:$PATH
export PATH
cd kafka_2.13-2.6.0/config
../bin/kafka-server-start.sh server.properties
```

# Starting a Kafka visualizer (optional)

When starting development or integration work, you may wish to have a handy tool to show you the data flowing through Kafka. There are several options, one such being [this tool](https://github.com/manasb-uoe/kafka-visualizer) (see the project page for more information). It can be installed
with docker via
```
docker pull kbhargava/kafka-visuals
```
and run like this (substitute host names and port numbers as appropriate). 
```
docker run -p 8080:8080 --rm kbhargava/kafka-visuals idevphp.idevcloud.com:2181 idevphp.idevcloud.com:9092 DEV
```

There is also a fork of this project [here](https://github.com/ThePrez/kafka-visualizer) that can be run on IBM i.


Kafka also comes with a single-topic visualizer that can run in your SSH terminal, for instance

```
JAVA_HOME=/QOpenSys/pkgs/lib/jvm/openjdk-11
export JAVA_HOME
PATH=$JAVA_HOME/bin:$PATH
export PATH
cd kafka_2.13-2.6.0/config
../bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic mytopic
```

# (Optional) Configure to run via Service Commander
The [Service Commander](https://github.com/ThePrez/ServiceCommander-IBMi) utility can be used for easily managing Zookeeper and Kafka jobs. See its project page for example configurations and documentation.

