const bear = require('../app/models/bear');

if (process.argv[2] === undefined) {
  console.log('Syntax: test_bear_removeById id');
  process.exit(-1);
}
const id = process.argv[2];

const bb = new bear.Bear();
bb.removeById(id, (res) => {
  console.log('Response: %s', JSON.stringify(res));
});
