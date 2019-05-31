# Books Example

This project is an example Node.js application using express framework on IBM i.

## Purpose

- Demo a RESTful web application and connect to DB2 for i from Node.js using the [idb-pconnector](https://bitbucket.org/litmis/nodejs-idb-pconnector) library.

- Demo cookie based authentication routes with the help of [passport.js](http://www.passportjs.org/)

- Demo appmetrics-dash

## Prerequisites

- node.js version 8 or newer

- git to clone this example

- g++ to build appmetrics

- python required by appmetrics build process

- curl to simulate requests with `demo.sh`

`yum install nodejs10 git gcc-cplusplus python3 curl`

## Setup

**NOTE**

The setup below is required when building appmetrics from source using `node-gyp`

Set Path

`export PATH=/QOpenSys/pkgs/bin:$PATH`

Create `python` symlink to point to python3

`ln -s /QOpenSys/pkgs/bin/python3 /QOpenSys/pkgs/bin/python`


## Getting Started

1) clone this project and change directory to the project

2) install dependencies
   
   `npm install`

3) create schema and table
   
   `npm run setup`

4) start the server
   
   `npm start`

5) access http://hostname:port/

## Populate appmetrics-dash

Simulate requests to the express books application with `demo.sh`

`usage: demo.sh host [PORT=4000]`

`PORT=4000 demo.sh http://hostname.com`

Access appmetrics-dash by visiting `http://hostname:port/appmetrics-dash`

## Author

* [Abdirahim Musse](https://github.com/abmusse)
