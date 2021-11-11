## WebSocket Example

## On IBM i
Install the dependencies --
```
git clone git@github.com:IBM/ibmi-oss-examples.git
cd ibmi-oss-examples/nodejs/wsexample/
npm i
```
Note: If you are using SSL, use this to create neccessary key and certificates --
```
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
```
Then you can launch the websocket server --
```
node index.js
```

## On your browser
1) Launch your favorite browser and enter http://your.server.ip:8888/WSConsole.html or https://your.server.ip:8889/WSConsole.html if you have SSL configured. If no problem occurs, the same page as shown in the Java example will be displayed.

2) In the first text box, fill in the WebSocket server address. It should be something like ws://your.server.ip:8888 or wss://your.server.ip:8889 if you need SSL / Transport Layer Security (TLS) connections. Then click Connect.

3) Now, we can fill in the second text box with the command you need to run. Click Run to send the request. 
