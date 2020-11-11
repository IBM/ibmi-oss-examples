# Restify for IBM i

## Purpose

Create a simple RESTful web API with basic authentication using [restify](http://restify.com/) on IBM i. Demonstrates the creation of both a server to create secured REST API endpoints, and a client to call and digest data from those endpoints.

Use [odbc](https://www.npmjs.com/package/odbc) to access Db2 and using JSON Web Tokens (JWT) as an authentication mechanism.

## Prerequisites

- `node.js` version 8 or newer

- `git` to clone this example

`yum install nodejs14 git`

- [ODBC installed and configured on the server](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md)

## Getting Started

1. clone this project

2. install dependencies

  `npm install`

3. start the server

  `npm start`

4. once the server is started, run the client

  `node client.js`
