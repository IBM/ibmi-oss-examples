# Silly Hats

## Purpose

The focus of this project is using node with [itoolkit](https://www.npmjs.com/package/itoolkit) REST interface.

This example is a simple [express](https://www.npmjs.com/package/express) application with [pug](https://www.npmjs.com/package/pug) frontend interface.

The project simulates adding GUI images in hat ordering. Also, enabled 'crude' textarea social media to chat the hat.

The interface was intentionally simple (ugly),to avoid reader getting lost in GUI details and focus on REST accessing IBM i data with itoolkit.

**NOTE**

While express/pug is most common application, I recommend JSON api style interface like project bears, flight400.

## Prerequisites

- node.js version 8 or newer

- git to clone this example

`yum install nodejs10 git`

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

   `git clone url`


2. install dependencies

   `npm install`

3. Restore Library from Save File

   Auto setup

   * `./setup.sh`

   Manual setup

    * `CPYFRMSTMF FROMSTMF('/path/to/hats.savf') TOMBR('/QSYS.LIB/QGPL.LIB/HATS.FILE')`

    * `RSTLIB SAVLIB(HATS) DEV(*SAVF) SAVF(QGPL/HATS)`

4. Configure User to access REST transport
   
   Preferred way is to set environment variables

    ```bash
      export TKUSER=USER
      export TKPASS=PASS
    ```

5. start the server

   `npm start`

6. access http://hostname:port/

# YIPS live demo

- [YIPS silly hats](http://yips.idevcloud.com/silly)
