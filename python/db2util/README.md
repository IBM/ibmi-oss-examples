# db2util dockerized example

This is an example Python application that calls db2util over an ssh connection
via [paramiko](https://github.com/paramiko/paramiko).

## Purpose

- Demo a dockerized python example accessing the Db2 data by calling [db2util](https://github.com/IBM/ibmi-db2util) program installed on your IBM i.

## Prerequisites

Ensure your target IBM i system has openssh installed and it is running.
Checkout this [article](https://www.seidengroup.com/2020/11/16/getting-started-with-ssh-for-ibm-i/) for getting started with SSH on IBM i.

## Getting Started

1) Clone this project and change directory to the project

2) Configure .env with the following:

    For password authentication configure the following within the .env file

    - `SSH_HOST`
    - `SSH_USER`
    - `SSH_PASSWORD`

    For key based authentication configure the following within the .env file

    - `SSH_HOST`
    - `SSH_USER`
    - `SSH_PRIVATE_KEY` - Path to your private key file
    - `SSH_PASSPHRASE` - Specify If your private key requires a passphrase

    Note using key based authentication within the docker container will require
    generating a key and copying over to the target system.

   ```bash
   ssh-keygen -t rsa -b 4096 -f ./id_rsa
   # copy the key to the target remote system
   ssh-copy-id -i ./id_rsa remoteuser@remotehost
   ```

3) Build the docker image

   ```bash
   docker build -t db2util_example .
   ```

4) Run the docker container

   ```bash
   docker run --env-file .env db2util_example
   ```

## Demo

[![Demo](https://asciinema.org/a/415656.svg)](https://asciinema.org/a/415656 "Demo")