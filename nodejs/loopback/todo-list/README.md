# todo-list

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

This example shows how to manipulate DB2 data with the Loopback framework on IBM i. For more details, please refer to the manual  https://loopback.io/doc/en/lb4/DB2-for-i-connector.html

# Prerequisite

## Installing Node.js
`yum install nodejs12`

## Installing GCC and development tools
`yum group install "Development tools"`

## Installing ODBC driver
`yum install unixODBC-devel`

For more details about how to enable the ODBC driver on IBM i, please refer to this manual -- https://www.ibm.com/support/pages/odbc-driver-ibm-i-pase-environment

# Install
In the root of the todo-list directory, call `npm i` to install the dependencies.

# Create the example SQL table
```
CREATE OR REPLACE TABLE "Todo"("id" INTEGER, "title" VARCHAR(100), "desc" VARCHAR(100), "isComplete" SMALLINT);

INSERT INTO "Todo" VALUES (0, 'Take over the galaxy', 'MWAHAHAHAHAHAHAHAHAHAHAHAHAMWAHAHAHAHAHAHAHAHAHAHAHAHA', 1);

SELECT * FROM "Todo";
```

# Run
Call `PORT=8099 npm start` to start the loopback server.

# API Explorer
Visit http://yourip:8099/explorer/ to verify the created APIs.

Or directly call `curl -X GET "http://yourip:8099/todos/0" -H "accept: application/json"` to view the response.
