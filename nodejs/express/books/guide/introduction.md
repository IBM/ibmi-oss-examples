# Introduction

Express.js, often simply referred to as Express, is a web framework for Node.js that allows you to create powerful web applications. With more than 5 million weekly downloads, express is one of the most popular npm packages for use with Node.js, and is by far the most popular web framework. This means there is a robust community to help with any issues that arise during the development of your application, and many examples used in other npm packages often assume you are running Express. 

This set of tutorials will get you started with running Express on your IBM i System machine. The example application is a book inventory. To begin, we will create a simple server that can be accessed on your local network through your browser. From there, we will access the DB2 database at the heart of the i System to store and retrieve data that can be updated through the web app. Next we create the routes and api for our application. Finally, secure it by allowing only authenticated users to add , update , or delete books. From there, the world is your oyster as you continue to explore the power of Express for building web applications.

Before you begin, make sure you have run through the Node.js tutorial to get your environment set up. It is quick, and without Node.js and npm installed on your system, none of these tutorials will work!

This set of tutorials will walk you through how to set up your **package.json** file step by step by running `npm init` to create the file, then running `npm install <package-name> --save` as new functionality is needed. If you prefer, you can clone or download the source code from our [repo](https://github.com/IBM/ibmi-oss-examples/tree/master/nodejs). Once obtained simply run `npm install` within the project root to install the required node modules. Or continue following along to setup your project incrementally.

```javascript
{
  "name": "bookstore",
  "version": "1.0.0",
  "description": "Restful API with authentication using passport.js",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "setup": "node createBooksTable.js",
    "start": "node app.js"
  },
  "author": "Abdirahim Musse",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.18.3",
    "connect-flash": "^0.1.1",
    "ejs": "^2.6.1",
    "express": "^4.16.3",
    "express-session": "^1.15.6",
    "idb-pconnector": "^1.0.2",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "appmetrics-dash": "^4.0.0"
  },
  "devDependencies": {
    "eslint": "^5.12.1",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.15.0"
  }
}

```