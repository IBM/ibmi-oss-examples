const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {dbconn, dbstmt} = require('idb-connector');

const sSql = 'SELECT LSTNAM FROM QIWS.QCUSTCDT';
const connection = new dbconn();
connection.conn('*LOCAL');
const statement = new dbstmt(connection);

const alldata = statement.execSync(sSql);
statement.close();
connection.disconn();
connection.close();

// console.log(JSON.stringify(alldata));  // for debug

const app = express();

app.use(bodyParser.json());

// Let us build the fake timeserie data
const timeserie = [];
let now = Date.now();
let decreaser = 0;

for (let i = 0; i < 5; i += 1) {
  timeserie[i] = { target: alldata[i].LSTNAM, datapoints: []};
  for (let y = 0; y <= 100; y += 1) {
    timeserie[i].datapoints.push([
      500 * Math.random(), 
      Math.round((now - decreaser) / 1000) * 1000
    ]);
    decreaser += 50000;
  }
}
// console.log(JSON.stringify(timeserie));  // for debug

// Let us build the fake annotations data
const annotations = [];
now = Date.now();
decreaser = 0;

for (let i = 0; i < 5; i += 1) {
  let annot = {
    name: 'annotation name',
    enabled: true,
    datasource: 'simple JSON datasource',
    showLine: true,
  };
  annotations.push({
    title : alldata[i].LSTNAM,
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

  if (req.body.adhocFilters && req.body.adhocFilters.length > 0) {
    fakeData = countryTimeseries;
  }

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
