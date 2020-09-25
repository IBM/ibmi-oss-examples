# Node.js SSH Db2 Example

Node.js application that uses an SSH connection
and [db2util](https://github.com/IBM/ibmi-db2util) to run Db2 queries. Since no platform-specific modules are required, this technique can be used from any operating system, including Windows, Linux, Mac, IBM i, or even cloud-native applications.

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

3) Configure `SSH_HOST`, `SSH_USER`, and `SSH_PASSWORD` environment variables within the .env file. Or, to use key based authentication instead, configure `SSH_HOST`, `SSH_USER`, and `SSH_PRIVATE_KEY` environment variables, with `SSH_PRIVATE_KEY` being the path to your private key file.

4) Run the app
   
   ```bash
   npm start
   ```
