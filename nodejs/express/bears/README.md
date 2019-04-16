# Bears Example

## Purpose
The focus of this project is to create a RESTful application using [express](https://www.npmjs.com/package/express) and [idb-connector](https://www.npmjs.com/package/idb-connector).

This example is a simple simulation of a project with customer requirements.

The customer wants one service for both business REST JSON clients (other programs),
and traditional browser customers.
A simulated project constraint of two different teams was added, where JSON API people deal with the model (db2), and, art centric web designer people deal with the view (browser). This is common for sites with theme.


## Connection Pool
This project demonstrates a version of connection pooling technique. Why? 
DB2 rule is never share a connection or statement across threads at same time.
Node.js is not threaded per say, instead uses an event loop main thread to process the script. However, long running activities, mostly I/O operations, are run asynchronously with worker threads away from main event loop. The [idb-connector](https://www.npmjs.com/package/idb-connector) uses worker threads to perform database operations. Therefore, we must use a connection pool to avoid sharing a connection across threads.

## Cache
A 'live' cache is demonstrated in bear model to achieve customer requirements for 2000/hits a second (millions per hour). 
In this case, reality of the consumer experience is not even noticeably impacted 
by a 3 second memory cache truth. That is to say, add or update of bear names is so rare, probability of a 
cache lie event occurring approaches zero.

## Prerequisites

- node.js version 8 or newer

- git to clone this example

- curl to run simple tests

`yum install nodejs10 git curl`

## Getting Started

1. clone this project and change directory to the project


2. install dependencies

   `npm install`

3. create schema and table

   `npm run setup`

4. start the server

   `npm start`

5. access http://hostname:port/

# Testing
The example tests with `curl` to act as a view component to check out REST JSON API. 

You could use any other REST capable language to consume JSON APIs bear project (php, ruby, python, etc.).

Use of standard REST http verbs like GET, POST, DELETE, PUT, enables consistency across languages.

When you move on to html/javascript interface, you will find jQuery and other javascript elements exactly the same. All language API REST clients served with one nodejs service (including browser), per customer requirement.


```bash
curl http://hostname:47710/zoo/api
{"message":"hooray! welcome to our api!"}

# GET list
curl http://hostname:47710/zoo/api/bears
[{"ID":"1","NAME":"grizzly bear"}]

# GET by id
curl http://hostname:47710/zoo/api/bears/1
[{"ID":"1","NAME":"grizzly bear"}]

# POST save name
curl -d "name=Sally" -X POST http://hostname:47710/zoo/api/bears

# DELETE by id
curl -X DELETE http://hostname:47710/zoo/api/bears/2

```

## YIPS live demo
* [YIPS bears](http://yips.idevcloud.com/zoo)