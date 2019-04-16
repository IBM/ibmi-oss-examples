const router = require('express').Router();
// const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const min = 2;
const max = 1e7;

function generatePrimes(start, range) {
  let primes = [];
  let isPrime = true;
  let end = start + range;

  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i%j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
  return primes;
}

router.get('/', (req, res) =>{
  res.render('primes');
});

router.get('/calc', (req, res) => {
  const start = process.hrtime.bigint();
  console.log(`start ns: ${start}`);
  let p = generatePrimes(min, max);
  const end = process.hrtime.bigint();
  console.log(`end ns: ${end}`);
  let time = end - start;
  console.log(`diff ns: ${time}`);

  if (time > Number.MAX_SAFE_INTEGER){
    time = time.toString();
  } else {
    time = new Number(time);
    time = ((time) / (1e9));
  }
  res.send({primes: p, time: time});
});

module.exports = router;
