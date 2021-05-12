## Grafana Backend Example

## On IBM i
```
git clone git@github.com:IBM/ibmi-oss-examples.git
cd ibmi-oss-examples/nodejs/grafana-backend/
npm i
node index.js
Server is listening to port 3333
```
 
## On Grafana server
1) Install the SimpleJson plugin -> https://grafana.com/grafana/plugins/grafana-simple-json-datasource/

Note: If you are using Docker, use this to run Grafana with the SimpleJson plugin 
```
docker run -d \
  -p 3000:3000 \
  --name=grafana \
  -e "GF_INSTALL_PLUGINS=grafana-simple-json-datasource" \
  grafana/grafana
```
2) Restart your Grafana server
3) Open the grafana GUI from your browser (http://IP:3000 by default)
4) Add data source (type: SimpleJson) with the IP:port of your IBM i node.js server instance.
5) Import the SysStatus.json file from the grafana GUI

![screen shot](./screenshot.png?raw=true)
