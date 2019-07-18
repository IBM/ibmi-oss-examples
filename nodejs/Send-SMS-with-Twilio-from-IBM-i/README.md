# Send SMS with Twilio from IBM i

## How does it work

Twilio provides a Node.js REST API to send SMS messages. This solution give you a simple RPGLE program to send the SMS data to a DataQueue. When the SMS message is sent to the DataQueue a Node.js program is waiting for new SMS messages. Once the message arrived the Node.js program send the message with the Twilio REST-API.

## The JSON SMS data from IBM i DataQueue
```
{"body":"Hello World", "to":"+123456789", "from":"+123456789"}
```
## You need
```
- Node.js 8.x / 10.x
- idb-connector: https://www.npmjs.com/package/idb-connector
- itoolkit: https://www.npmjs.com/package/itoolkit
- Twilio Node.js API: https://www.npmjs.com/package/twilio
- The Twilio credentials - accountSid, authToken, SMS from number - from www.twilio.com/console
```

Go [here](http://ibm.biz/ibmi-rpms) to get started with Node.js on IBM i.

## Once you have installed Node.js set Node.js to V10

```
SSH Terminal>
$ PATH=/QOpenSys/pkgs/bin:$PATH
$ nodever 10
```

## Check your Node.js version

```
SSH Terminal>
$ PATH=/QOpenSys/pkgs/bin:$PATH
$ node -v
v10.15.0  
```

## Create your project

```
SSH Terminal>
$ PATH=/QOpenSys/pkgs/bin:$PATH
$ mkdir myproject
$ cd myproject
$ npm init
$ npm i idb-connector itoolkit twilio --save
```

## Enable QRCVDTAQ wait for Node.js

```
You'll find the Class iDataQueue in the file myproject/node_modules/itoolkit/lib/idataq.js
copy this file to the new file myproject/node_modules/itoolkit/lib/idataq2.js
and change the following statements:

line 70: iDataQueue.prototype.receiveFromDataQueue = function(name, lib, length, wait, cb) {
line 76: pgm.addParam(wait, "5p0");
```

## Manual Install

```
Copy the sendSMSDataFromQueue.js file to the directory myproject
```

## Start the Node.js program on your IBM i

```
SSH Terminal>
$ PATH=/QOpenSys/pkgs/bin:$PATH
$ cd myproject
$ node sendSMSDataFromQueue.js
```
