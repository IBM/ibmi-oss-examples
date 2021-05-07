const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {dbconn, dbstmt} = require('idb-connector');

const sSql = "select AVERAGE_CPU_UTILIZATION, ACTIVE_JOBS_IN_SYSTEM, CURRENT_TEMPORARY_STORAGE, SYSTEM_ASP_USED from QSYS2.SYSTEM_STATUS_INFO";
const hSql = "select * from QSYS2.HTTP_SERVER_INFO";

const connection = new dbconn();
connection.conn('*LOCAL');
const statement = new dbstmt(connection);

const datapoints_limit = 500;
const refresh_interval = 5000;   // query interval (ms)

const app = express();
app.use(bodyParser.json());

const timeserie = [];

function updateJSON() {
  const sys_usage = statement.execSync(sSql);
  statement.closeCursor();
  // console.log(JSON.stringify(sys_usage));  // for debug

  const now = Math.round(Date.now() / 1000) * 1000;

  Object.keys(sys_usage[0]).forEach((key) => {
    let found = false;
    for (const item of timeserie) {
      if (item.target == key) {
        found = true;
        if(item.datapoints.length > datapoints_limit)
          item.datapoints.shift();
        item.datapoints.push([parseFloat(sys_usage[0][key]), now]);
        break;
      }
    }
    if (found == false)
      timeserie.push( { target: key, datapoints: []} );
  });
}

setInterval(updateJSON, refresh_interval); // Refresh every 5 sec
// console.log(JSON.stringify(timeserie));  // for debug

// Let us build the fake annotations data
const annotations = [];
now = Date.now();
decreaser = 0;

for (let i = 0; i < timeserie.length; i += 1) {
  let annot = {
    name: 'annotation name',
    enabled: true,
    datasource: 'simple JSON datasource',
    showLine: true,
  };
  annotations.push({
    title : "System Usage",
    time : (now - decreaser),
    text : 'text',
    tags : 'tags',
    annotation : annot
  });
  decreaser += 1000000;
}

function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'accept, content-type');
}

// / should return 200 ok. Used for "Test connection" on the datasource config page.
app.all('/', (req, res) => {
  setCORSHeaders(res);
  res.send('Test OK!');
  res.end();
});

// /search used by the find metric options on the query tab in panels.
app.all('/search', (req, res) => {
  setCORSHeaders(res);
  const result = [];
  timeserie.forEach((ts) => {
    result.push(ts.target);
  });
  res.json(result);
  res.end();
});

// /annotations should return annotations.
app.all('/annotations', (req, res) => {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(annotations);
  res.end();
});

// /query should return metrics based on input.
app.all('/query', (req, res) => {
  setCORSHeaders(res);
  // console.log(req.url);
  // console.log(req.body);

  const tsResult = [];

  req.body.targets.forEach((target) => {
    const k = timeserie.filter((t) => {
      return t.target === target.target;
    });
    k.forEach((kk) => {
      tsResult.push(kk);
    });
  });
  res.json(tsResult);
  res.end();
});

app.listen(3333);

console.log('Server is listening to port 3333');
