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
2) Restart your Grafana server
3) Add data source (type: SimpleJson) with the IP:port of your IBM i node.js server instance.
4) Add a dashboard query
5) Select a serie of `timeserie` from the dropdown list.

![screen shot](./screenshot.png?raw=true)
