# Hapi Basic Auth for IBM i

## Purpose

Create a simple RESTful web API with basic authentication using [hapi](https://hapijs.com/) framework on IBM i.

Use [idb-pconnector](https://github.com/IBM/nodejs-idb-pconnector/) to access DB2 and validate IBM i user profile.

**NOTE**

This example uses HTTP and is intended to be used for local testing.

This was done to provide quick example without setting up of certificates.

Almost always Basic Auth is used in conjunction with HTTPS to securely encrypt credentials.

Using [basic auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme) without HTTPS in production is a BAD IDEA!

## Prerequisites

- `node.js` version 8 or newer

- `git` to clone this example

- `curl` to perform requests

`yum install nodejs10 git curl`

## Getting Started

1. clone this project

2. install dependencies

   `npm install`

3. start the server

   `npm start`


## Testing

### GET
```bash
curl --user user:pass http://hostname:4000/customer/938472
```

### POST

```bash

curl --user user:pass -d '{"cusnum":9008, "lstnam":"Bryant", "init":"K B", "street":"100 Broadway", "city":"LA", "state":"CA"}' -H 'Content-Type: application/json' -X POST http://hostname:4000/customer

```
### PUT
```bash

curl --user user:pass -d '{"cusnum":9008, "lstnam":"Jordan", "init":"M J"}' -H 'Content-Type: application/json' -X PUT http://hostname:4000/customer

```

### DELETE

```bash
curl --user user:pass -X DELETE http://hostname:4000/customer/9008
```

For more details using curl checkout this [gist](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58)
