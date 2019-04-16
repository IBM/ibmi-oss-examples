# Hapi Cookie Based Authentication for IBM i

## Purpose

Create an application with cookie based authentication using [hapi](https://hapijs.com/) with [hapi-auth-cookie](https://hapijs.com/tutorials/auth?lang=en_US#cookie) strategy.

To authenticate the IBM i profile a database connection is established using [idb-pconnector](https://www.npmjs.com/package/itoolkit). The established connection is saved off for later use.

Once authenticated a session (cookie) is set on the client side.

On the server side session id from the cookie is validated to ensure session it is still active.

In this example sessions expire in 3 minutes.

Once authenticated access to `/customer` route is permitted, where you can search for a customer.

The table used to perform the customer search is the built in `QIWS.QCUSTCDT` table.

An added requirement to this example is that the SQL query must be run be the as the authenticated user.

The established connection saved earlier is used and cleaned up once the session has expired.

### Background

This example is an update to Aaaron Bartell's [Hapi to Authenticate You](https://www.mcpressonline.com/programming/programming-other/techtip-hapi-to-authenticate-you) example.

### Notable Changes

 - Updated to use latest version of Hapi.js API that uses promises rather than callbacks

 - DB2 connection is used to perform authentication rather than call `QSYSGETPH` using [itoolkit](https://github.com/IBM/nodejs-itoolkit)

 - Removed `db2ipool` database pool implementation. [idb-pconnector](https://github.com/IBM/nodejs-idb-pconnector#dbpool) provides connection pooling
 

## Prerequisites

- node.js version 8 or newer

- git to clone this example

`yum install nodejs10 git`


## Getting Started

1. clone this project and change directory to the project


2. install dependencies

   `npm install`


3. start the server

   `npm start`

4. access http://hostname:port/