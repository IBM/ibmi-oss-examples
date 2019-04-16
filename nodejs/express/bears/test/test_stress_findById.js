const bear = require('../app/models/bear');

if (process.argv[2] === undefined) {
  console.log('Syntax: test_bear_findById id');
  process.exit(-1);
}
const testId = process.argv[2];
const testWaitAvailableMax = 5;
const testConnectionsMaxPool = 14;
const testOutgoingSubmit = 3;
const testOutgoingRequestsMax = 140;
let testWaitAvailableCount = 0;
let testIncomingResponse = 0;
let testOutgoingRequests = 0;
let testMakingMore = true;


function checkPool(pond) {
  const { pool } = pond;
  console.log('=== Pool length %d requests=%d responses=%d ===', pool.length, testOutgoingRequests, testIncomingResponse);
  if (testMakingMore && (pool.length > testConnectionsMaxPool || testOutgoingRequests > testOutgoingRequestsMax)) {
    if (pool.length > testConnectionsMaxPool) {
      console.log('=== Pool length %d beyond max pool, no more submits (wait response only) ===', pool.length);
    } else if (testOutgoingRequests > testOutgoingRequestsMax) {
      console.log('=== Pool length %d, beyond maximum test requests %d, no more submits (wait response only) ===', pool.length, testOutgoingRequests);
    }
    clearInterval(timeout);
    testMakingMore = false;
  }
  let complete = true;
  for (let i = 0, len = pool.length; i < len; i += 1) {
    const inuse = pool[i].getInUse();
    if (inuse) {
      complete = false;
      console.log('Pool in use %d', i);
    } else {
      console.log('Pool available %d', i);
    }
  }
  if (!testMakingMore) {
    if (complete) {
      console.log('=== Pool length %d. Test success. requests=%d responses=%d ===', pool.length, testOutgoingRequests, testIncomingResponse);
      process.exit();
    } else {
      console.log('=== Pool length %d, waiting for all to return to available (wait %d of %d) ===', pool.length, testWaitAvailableCount, testWaitAvailableMax);
    }
    testWaitAvailableCount += 1;
    if (testWaitAvailableCount > testWaitAvailableMax) {
      console.log('=== Pool length %d. Test failed. requests=%d responses=%d ===', pool.length, testOutgoingRequests, testIncomingResponse);

      // check connection still working
      console.log('*** check connection still working *** ');
      for (let i = 0, len = pool.length; i < len; i += 1) {
        const bconn = pool[i];
        let inuse = bconn.getInUse();
        if (inuse) {
          console.log('=== %d really dead (inuse=%d) === ',i, inuse);
          bconn.detach();
          inuse = bconn.getInUse();
          console.log('=== %d not anymore (inuse=%d) === ',i, inuse);
          try {
            bconn.stmt.execSync("SELECT TABLE_OWNER, TABLE_NAME FROM QSYS2.SYSTABLES where TABLE_NAME='BEAR'", (result) => {
              bconn.detach();
              console.log(`=== result ${JSON.stringify(result)} ===`);
            });
          } catch (ex) {
            bconn.detach();
            console.log('=== result exception ===');
          }
        }
      }

      process.exit();
    }
  }
}

function responseMe(res) {
  testIncomingResponse += 1;
  console.log('Response: %s', JSON.stringify(res));
}


function requestMe(bb) {
  console.log('=== Submit %d requests requests=%d responses=%d ===', testOutgoingSubmit, testOutgoingRequests, testIncomingResponse);
  testOutgoingRequests += testOutgoingSubmit;
  for (let i = 0; i < testOutgoingSubmit; i += 1) {
    bb.findById(testId, responseMe);
  }
}

const bb = new bear.Bear();
// submit requests every second
const timeout = setInterval(requestMe, 1000, bb);
// check request/response match every 5 seconds
bb.debugBearPool((pool) => {
  setInterval(checkPool, 5000, pool);
});
