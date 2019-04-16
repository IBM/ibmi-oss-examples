const bear = require('../app/models/bear');

const bb = new bear.Bear();
bb.find((res) => {
  console.log('Response: %s', JSON.stringify(res));
});
