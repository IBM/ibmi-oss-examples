# Koa Application

## Purpose

Create a web application using Koa.js to serve content from IBM i. Application uses koa middleware and the `odbc` connector to create a connections to Db2 for i.

Importantly, this example demonstrates how to use XMLSERVICE (through the `itoolkit` package) to authenticate IBM i user credentials. This pattern can be reused for _every_ Node.js package that wants to authenticate against IBM i.

**This application can be run either on IBM i or on any other system that has access to an IBM i system and has ODBC configured**

If running on a non-IBM i system, change the connection string in `db.js`.

## Prerequisites

- node.js version 8 or newer

  `yum install nodejs14` (on IBM i)

- XMLSERVICE installed on the target machine

- [ODBC installed and configured](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md)

- git to clone this example

  `yum install git` (on IBM i)


## Getting Started

1. clone this project and change directory to the project

    `git clone git@github.com:IBM/ibmi-oss-examples.git`

    `cd ibmi-oss-examples`


2. install dependencies

    `npm install`


3. start the server

    `npm start`

4. access http://hostname:port/