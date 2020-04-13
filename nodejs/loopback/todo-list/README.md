# todo-list

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

# Prerequisite

## Installing Node.js
`yum install nodejs12`

## Installing GCC and development tools
`yum group install "Development tools"`

## Installing ODBC driver
`yum install unixODBC-devel`

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

Or directly call `curl -X GET "http://ut25bp17.rch.stglabs.ibm.com:8099/todos/0" -H "accept: application/json"` to view the response.
