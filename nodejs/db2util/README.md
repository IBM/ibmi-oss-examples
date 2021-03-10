# Node.js SSH Db2 Example

Node.js application that uses an SSH connection and
[db2util](https://github.com/IBM/ibmi-db2util) to run Db2 queries.

Since no platform-specific modules are required, this technique can be used from
any operating system, including Windows, Linux, Mac, IBM i, or even cloud-native
applications.

## Prerequisites

- Install Node.js

    On IBM i this can be installed via yum from an SSH terminal with:

    ```bash
    yum install nodejs14
    ```

- Install db2util on your IBM i system

    ```bash
    yum install db2util
    ```

- Ensure you have OpenSSH server installed and running

## Getting Started

1) Clone this project and change directory into `ibmi-oss-examples/nodejs/db2util`

    ```bash
    git clone https://github.com/IBM/ibmi-oss-examples.git

    cd ibmi-oss-examples/nodejs/db2util
    ```

2) Install dependencies

   ```bash
   npm install
   ```

3) For password authentication configure the following within the .env file
    - `SSH_HOST`
    - `SSH_USER`
    - `SSH_PASSWORD`

    For key based authentication configure the following within the .env file
    - `SSH_HOST`
    - `SSH_USER`
    - `SSH_PRIVATE_KEY` - Path to your private key file
    - `SSH_PASSPHRASE` - Specify If your private key requires a passphrase

4) Run the app

   ```bash
   npm start
   ```
