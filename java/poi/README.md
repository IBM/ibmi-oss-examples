# [Apache POI](https://poi.apache.org/) Example

Java application that creates an Excel worksheet
with data from Db2 for i table.

## Prerequisites

- Install Maven

    On IBM i this can be installed via yum from an SSH terminal with:

    ```bash
    $ yum install maven
    ```

## Getting Started

1) Clone this project and change directory into `ibmi-oss-example/java/poi`

    ```bash
    git clone https://github.com/IBM/ibmi-oss-examples.git

    cd ibmi-oss-examples/java/poi
    ```

2) Compile and install dependencies

   ```bash
   $ mvn compile
   ```

3) Configure `DB_HOST`, `DB_USER`, and `DB_PASS` enviorment variables within the [.env](.env) file. Or enter credentials interactively when prompted.

4) Run the app
   
   ```bash
   $ mvn exec:java -Dexec.mainClass="App"
   ```

