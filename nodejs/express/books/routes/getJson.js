const router = require('express').Router();
const http = require('http');

router.get('/', (req, res) => {

  console.log('start get json request');

  let getJson = http.get('http://nodejs.org/dist/index.json', (response) => {
    const {statusCode} = response;
    const contentType = response.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n'
                            Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n
                            Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      response.resume();
      return;
    }

    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log('sending json response');
        res.send(parsedData);
      } catch (e) {
        console.error(e.message);
        res.send({error: e.message});
      }
    });
  });

  getJson.on('error', (e) => {
    console.error(`HTTP Request error: ${e.message}`);
    res.status(400).send({error: 'Unable to get json'});
  });

});

module.exports = router;
