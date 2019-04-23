# Running Node.js with IBM HTTP Server for i

## Create a HTTP server instance
From WebAdmin GUI (http://yourhost:2001/HTTPAdmin), create a HTTP server named **FASTCGI**.

And then add the following statements to the configuration file.
```
LoadModule zend_enabler_module /QSYS.LIB/QHTTPSVR.LIB/QZFAST.SRVPGM
AddType application/x-httpd-javascript .jsx
AddHandler fastcgi-script .jsx
```

Replace the default index.html file with following content --
```
<!DOCTYPE HTML>
<html lang="en-US">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>FastCGI Example</title>
</head>
<style>
input {
  height:30px;
  width:200px;
  text-align:center;
  border:#ccc solid 1px
}
</style>
<body>
<form name="input" action="dspsysval.jsx" method="get">
<input type="text" name="key" placeholder="QCCSID"/>
<input type="submit" value="Display System Value"/>
</form>
</body>
</html>
```

## Setup the FastCGI environment

Clone this **node_fastcgi** project to your IBM i system. (e.g. /home/name/node_fastcgi)

In this project folder, call `npm i` to install the dependencies.

Copy the **fastcgi.conf** file to the configuration folder of the **FASTCGI** HTTP server created before.
```
cp fastcgi.conf /www/fastcgi/conf
```
Call below CL command to give proper authorities to **fastcgi.conf**.
```
CHGOWN OBJ('/www/fastcgi/conf/fastcgi.conf') NEWOWN(QSYS)
CHGAUT OBJ('/www/fastcgi/conf/fastcgi.conf') USER(QTMHHTTP) DTAAUT(*RX)
```

Then you can choose one of below two approaches -- **Remote Mode** or **Local Mode**

- Remote Mode

If you run HTTP server and Node.js FastCGI server at different systems, you may try the `Remote` Mode.

In this mode, the Node.js FastCGI server communicates with the HTTP server instance in a RESTful way.

Change the binding `ip` and `port` in the `fastcgi.conf` file. 

This is the address of the backend FastCGI server. 

In this example, the HTTP server and the FastCGI server are in the same system, so it is `127.0.0.1`.

```
Binding="127.0.0.1:8088"
```

**Note:** The binding port should keep the same with the listening port number defined in `index.js`.

```
fcgiServer.listen(8088);  //Remote mode
```

Launch the FastCGI server. In the `node_fastcgi` project folder, call

```
node index.js
```

- Local Mode

If you run HTTP server and Node.js server at the same system, you may try to use the Local Mode.

In this mode, the Node.js server instance will be invoked by the HTTP server automatically.

Give HTTP server authority to access your Node.js code
```
CHGOWN OBJ('/home/name/node_fastcgi') NEWOWN(QSYS) SUBTREE(*ALL)
CHGAUT OBJ('/home/name/node_fastcgi') USER(QTMHHTTP) DTAAUT(*RX) SUBTREE(*ALL)
```

Change index.js to listen to stdin
```
fcgiServer.listen();  //Local mode
// fcgiServer.listen(8088);  //Remote mode
```

Change fastcgi.conf to disable remote mode and enable local mode. And specify the path of your index.js correctly.
```
; Local Mode --the HTTP server should run at the same IP address with the FastCGI server.
Server type="application/x-httpd-javascript" CommandLine="/home/name/node_fastcgi/index.js" StartProcesses="1"

; Remote Mode --the FastCGI server can run at different IP addresses. Set 'Binding=' to the IP/port that the FastCGI server listens to.
; ExternalServer type="application/x-httpd-javascript" Binding="127.0.0.1:8088" ConnectionTimeout="300" RequestTimeout="300"

; Where to place socket files
IpcDir /www/fastcgi/logs
```

## Launch the HTTP server

When you have either **Local Mode** or **Remote Mode** configured. You can launch the front-end HTTP server now.

Start it from the WebAdmin GUI (http://hostname:2001/HTTPAdmin) or by below CL command
```
STRTCPSVR SERVER(*HTTP) HTTPSVR(FASTCGI)
```

Then you can access http://yourhost:port/index.html to verify.
