# Setting up Express

In this tutorial we will be creating an express application to keep track of simple book inventory. We will setup an express application , connect to DB2 using the idb-pconnector, create routes to access our application , and secure routes that only authorized user should access.

Whenever creating a new node project you should start with setting up the **package.json** file. This file keeps track of things like our application name, version, author, and which packages our application is dependent on. So navigate to where you want these tutorials to live \(or create a new directory for them, with a command such as `mkdir express-tutorial` and then `cd express-tutorial` and then run `npm init`.

This command tells npm to create a package.json file in the directory, which in turn describes our application and its dependencies so it can be rebuilt at a later date. You will be prompted to enter some information to put in some packages.json fields, but for now they can all be left at their defaults.

Once our package.json file has been created, we can begin adding packages from npm that we are going to be using in our tutorial. Because this is an Express tutorial, we are obviously going to need the Express package. So in your terminal, run:

`npm install --save express`

The terminal will begin downloading the express package. After it is complete, you should see a message similar to:

`+ express@4.16.3
added 50 packages in 8.276s`

But wait, you only wanted to download Express! Why did you add 49 other packages as well? Well, express depends on those packages to function correctly. All of these packages live in a new directory named **node\_modules** that was created in your application directory. If you enter the command `ls ./node_modules`, you can get a print out of all of the packages that you have downloaded for your application.

With express installed, we can now begin writing our application. Open a new file named **app.js** and copy the following code \(we will go over what it does after we run our program\).

```javascript
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const port = process.env.PORT || 3001;

app.get('/hello', function (req, res) {
  res.send('Hello World!');
})

app.get('/hello/:name', function (req, res) {
    res.send('Hello ' + req.params.name + "!");
  })
 
app.listen(port);
```

The above code first requires the express package and then invokes a new express application. The schema variable will be used later will be used in tutorial 2 when the database will be created. Express version 4 and up does not ship with functionality to parse the body of an HTTP request so we do so by requiring the `bodyParser` package. We will be using the urlencodedParser to parse POST and PUT Request parameters later on. Next we define the port to be used by first checking if an environment variable named port is already set if not the port will default to 3001. Next we set the view engine to be used within our express app. For this tutorial we used ejs as the template engine to render our views but you can use whichever one you prefer. Then we set the static directory for our js , css , and other static files. Lastly we instruct our express app to listen on the port specified earlier.

When you have app.js saved, you can run it by simply calling `node app.js` in your terminal. Nothing will print in the terminal, but your web server should be running. In your browser, navigate to the URL: `<your System i address>:5000/hello`.  You should see "Hello World" printed to your browser. Similarly, if you navigate to `<your System i address>:5000/hello/mark`, you should see "Hello mark!" printed to your browser. 

Express itself has functions for all HTTP methods, such as GET, POST, and PUT, and these functions each take a route string and a callback function. Understanding callback functions is key to understanding development on the Node.js platform, but it is a topic outside of the scope of this tutorial. Suffice to say, when /hello gets called on line 4, the `function(req, res) { ... }` is called when the . The **req** in the function signature is the **request object**, and holds data that was sent to the server \(and from other functions above the .get function on the middleware stack\), while the **res** is the **response object**, which is what your server is returning the caller. In this case, res.send sends a string to the browser, which then outputs it on the screen.

We have also defined a route that includes a request parameter. By hitting the  /hello/:name route, you should see the browser output "Hello name!", where name is whatever you have specified in the URL. Notice in our code, the request object has a `params` property that itself is an object with a property that has the same name as the route parameter we specified. Using route parameters This can be useful for defining many different routes that have identical logic that can be dynamic based on the request object passed \(such as application/:accountname for displaying the account for a particular user\).

So far we have hit two routes that simply return static data. These hello routes are meant as examples to ensure express is configured and working properly. You can remove these two routes from **app.js** we will not be using them going forward. In the next tutorial, we will learn how to connect to DB2 from node and create our Books Table.