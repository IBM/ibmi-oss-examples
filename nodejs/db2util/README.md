# Node.js SSH Db2 Example

Node.js application that calls Db2 from a cloud-native application, using SSH
and [db2util](https://github.com/IBM/ibmi-db2util).

## Prerequisites

- Install Node.js

    On IBM i this can be installed via yum from an SSH terminal with:

    ```bash
    $ yum install nodejs14
    ```

- Install db2util on your IBM i system

    ```bash
    yum install db2util
    ```

- Ensure you have OpenSSH server installed and running

## Getting Started

1) Clone this project and change directory into `ibmi-oss-example/nodejs/db2util`

    ```bash
    git clone https://github.com/IBM/ibmi-oss-examples.git

    cd ibmi-oss-examples/nodejs/db2util
    ```

2) Install dependencies

   ```bash
   $ npm install
   ```

3) Configure `SSH_HOST`, `SSH_USER`, and `SSH_PASSWORD` enviorment variables within the [.env](.env) file. To use key based authentication configure `SSH_PRIVATE_KEY` environment variable with path to your private key file.

4) Run the app
   
   ```bash
   npm start
   ```
