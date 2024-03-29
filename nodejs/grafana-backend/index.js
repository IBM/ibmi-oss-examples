const express = require('express');
const config = require('config')
const bodyParser = require('body-parser');
const _ = require('lodash');
const {dbconn, dbstmt} = require('idb-connector');
const os = require('os');

console.log(config);

const hSql = config.get('settings.hSql');

const connection = new dbconn();
connection.conn('*LOCAL');
const statement = new dbstmt(connection);

const datapoints_limit = config.get('settings.datapoints_limit');


const oslevel = Number(os.release());

const app = express();
app.use(bodyParser.json());

const timeserie = [];
let table = [];

// set refresh interval given sql statement defined in config/default.yaml
function setSqlInterval() {
  for (const [key, sql_config] of Object.entries(config.get('metrics'))) {
    if (sql_config.include) {
      console.log("set interval for ", key);
      setInterval(updateJSON, sql_config.interval, sql_config.sql);
    } else {
      console.log("skipping: ", key);
    }
  }
}

function updateJSON(sql) {
  const now = Math.round(Date.now() / 1000) * 1000;
  sys_usage = statement.execSync(sql);
  statement.closeCursor();
  if (sys_usage && sys_usage.length >0) {
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
  if (oslevel >= 7.4)
    table = statement.execSync(hSql);
  statement.closeCursor();
}

setSqlInterval();

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
  const result = ['HTTP'];
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
  now = Date.now();
  // Let us build the annotations data
  const annotations = [];
  decreaser = 0;
  timeserie.forEach((an) => {
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
  });
  res.json(annotations);
  res.end();
});

// /query should return metrics based on input.
app.all('/query', (req, res) => {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  const tsResult = [];

  req.body.targets.forEach((target) => {
    if (target.target === 'HTTP') {
      tsResult.push(table);
    } else {
      const k = timeserie.filter((t) => {
        return t.target === target.target;
      });
      k.forEach((kk) => {
        tsResult.push(kk);
      });
    }
  });

  res.json(tsResult);
  res.end();
});

let port = process.env.PORT || config.get('app.port'); // 3333
app.listen(port);
console.log(`OS Level ${oslevel}. Server is listening to port ${port}`);

