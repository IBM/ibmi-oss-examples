# Books Example

This project is an example Node.js application using express framework on IBM i.

## Purpose

- Demo a RESTful web application and connect to DB2 for i from Node.js using the [node-odbc](https://github.com/markdirish/node-odbc) library.

- Demo cookie based authentication routes with the help of [passport.js](http://www.passportjs.org/)

## Getting Started

1) Clone this project and change directory to the project

2) Optional:
Configure systems by adding [DSN](https://ibmi-oss-docs.readthedocs.io/en/latest/odbc/using.html#dsns) entries to the [.odbc.ini file](.odbc.ini). Be sure to specify the System key value pair with the IP address or host name of your IBM i system.

### Run in Docker Container

1) Build the docker image

   ```bash
   docker build -t books_app .
   ```

2) Run the docker container

   ```bash
   docker run -d -p 4000:4000 books_app
   ```

3) Access <http://hostname:4000/>

### Run Outside of container

1) Install Node.js

   On IBM i run the following command:

   ```bash
   yum install nodejs14
   ```

2) Install package dependencies

   ```bash
   npm install
   ```

3) Start the server

   ```bash
   npm start
   ```

4) Access <http://hostname:port/>

## Authors

- [Abdirahim Musse](https://github.com/abmusse)
- [Vasili Skurydzin](https://github.com/V-for-Vasili)
