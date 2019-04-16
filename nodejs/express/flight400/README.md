# Flight400 Example

Welcome to flight 400 project, a simple nodejs example of accessing IBM i flight400 RPG code.

## Purpose

The focus of this project is create a pure REST application using [itoolkit](https://github.com/IBM/nodejs-itoolkit).

Everything is REST, JQuery GUI is using REST api (see view), node server.js using itoolkit REST to XMLSERVICE, etc.

This type of 'pure REST' application is common in 'rich client' configurations.
JQuery GUI view browser makes many async REST requests (json response) to IBM i.
To date, performance of pure REST application seems adequate.

The project is a multiple tier architecture for maximum flexibility. There are really two interfaces to Flight 400.

* First, traditional JQuery GUI make REST API calls to IBM i nodejs server through Apache (see conf).
* Second, programmable REST/JSON API interface (see API tab on application GUI). 

I suggest dual interface is best practice way to design any application you wish to export to web.
The programmable REST/JSON APIs allows extreme flexibility in designing custom interfaces to your valuable RPG logic.


## Prerequisites

- node.js version 8 or newer

- git to clone this example

- gzip to decompress save files

`yum install nodejs10 git gzip`

Setup the REST interface

Append configuration to default apache server conf: `/www/apachedft/conf/httpd.conf`

```text
ScriptAlias /cgi-bin/   /QSYS.LIB/QXMLSERVc .LIB/
<Directory  /QSYS.LIB/QXMLSERV.LIB/>
  AllowOverride None
  order allow,deny
  allow from all
  SetHandler cgi-script
  Options +ExecCGI
</Directory>
```
Start the Server:

`STRTCPSVR SERVER(*HTTP) HTTPSVR(APACHEDFT)`


Visit `http://HOSTNAME/cgi-bin/xmlcgi.pgm` from a browser. You should see an XML document.

## Getting Started

1. clone this project and change directory to the project


2. install dependencies

   `npm install`

3. restore library from save file
   
   * please refer to [flight400.md](flight400.md)

4. configure user to access REST transport
   
   preferred way is to set environment variables

    ```bash
      export TKUSER=USER
      export TKPASS=PASS
    ```

5. start the server

   `npm start`

6. access http://hostname:port/

## YIPS live demo
* [YIPS flight400](http://yips.idevcloud.com/flight400/) (click on API tab for REST details)