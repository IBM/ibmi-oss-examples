const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {dbconn, dbstmt} = require('idb-connector');

const sSql = 'SELECT AVERAGE_CPU_UTILIZATION, ACTIVE_JOBS_IN_SYSTEM, CURRENT_TEMPORARY_STORAGE FROM QSYS2.SYSTEM_STATUS_INFO';

const connection = new dbconn();
connection.conn('*LOCAL');
const statement = new dbstmt(connection);

const app = express();

app.use(bodyParser.json());

// Let us build the fake timeserie data
const timeserie = [];
timeserie[0] = { target: "CPU Usage", datapoints: []};
timeserie[1] = { target: "Active Jobs", datapoints: []};
timeserie[2] = { target: "Temp Storage Usage", datapoints: []};

function updateJSON() {
  const sys_usage = statement.execSync(sSql);
  statement.closeCursor();
  // console.log(JSON.stringify(sys_usage));  // for debug

  const now = Math.round(Date.now() / 1000) * 1000;

  if(timeserie[0].datapoints.length > 500)
    timeserie[0].datapoints.shift();
  timeserie[0].datapoints.push([
    parseFloat(sys_usage[0].AVERAGE_CPU_UTILIZATION), now
  ]);

  if(timeserie[1].datapoints.length > 500)
    timeserie[1].datapoints.shift();
  timeserie[1].datapoints.push([
    parseInt(sys_usage[0].ACTIVE_JOBS_IN_SYSTEM), now
  ]);

  if(timeserie[2].datapoints.length > 500)
    timeserie[2].datapoints.shift();
  timeserie[2].datapoints.push([
    parseInt(sys_usage[0].CURRENT_TEMPORARY_STORAGE), now
  ]);
}

setInterval(updateJSON, 5000); // Refresh every 5 sec
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
  _.each(timeserie, (ts) => {
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
  console.log(req.url);
  console.log(req.body);

  const tsResult = [];
  let fakeData = timeserie;

  _.each(req.body.targets, (target) => {
    const k = _.filter(fakeData, (t) => {
      return t.target === target.target;
    });

    _.each(k, (kk) => {
      tsResult.push(kk);
    });
  });
  res.json(tsResult);
  res.end();
});

app.listen(3333);

console.log('Server is listening to port 3333');
