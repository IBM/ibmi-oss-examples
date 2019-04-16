/* eslint-disable new-cap */
/* eslint-disable max-len */

const incrementSize = 8;
const database = '*LOCAL';
const bearSchema = 'BEARS';
const bearTable = 'BEAR';
const idb = require('idb-connector');
// bear response
//
// HTTP Verb  CRUD            Entire Collection (e.g. /customers)           Specific Item (e.g. /customers/{id})
// =========  ==============  ============================================  =============================================
// POST       Create          201 (Created), 'Location' header with link    404 (Not Found).
//                                to /customers/{id} containing new ID.     409 (Conflict) if resource already exists.
// GET        Read            200 (OK), list of customers. Use pagination,  200 (OK), single customer.
//                                sorting and filtering to navigate         404 (Not Found), if ID not found or invalid.
//                                big lists.
// PUT        Update/Replace  404 (Not Found), unless you want to           200 (OK) or 204 (No Content).
//                                 update/replace every resource            404 (Not Found), if ID not found or invalid.
//                                 in the entire collection.
// PATCH      Update/Modify   404 (Not Found), unless you want to           200 (OK) or 204 (No Content).
//                                modify the collection itself.             404 (Not Found), if ID not found or invalid.
// DELETE     Delete          404 (Not Found), unless you want to           200 (OK).
//                                delete the whole collection               404 (Not Found), if ID not found or invalid.
// =============================================================================
const bearMsg10001 = 10001;
const bearMsg10001Text = 'access failed';
const bearMsg10002 = 10002;
const bearMsg10002Text = 'rows found';
const bearMsg10003 = 10003;
const bearMsg10003Text = 'no rows found';
const bearMsg10004 = 10004;
const bearMsg10004Text = 'insert success, last id';
const bearMsg10006 = 10006;
const bearMsg10006Text = 'row found id';
const bearMsg10007 = 10007;
const bearMsg10007Text = 'no row found id';
const bearMsg19999Text = 'message not available';

const bearCallback = (callback, iok, istatus, iresult, imessage, imdata) => {
  let msg = '';
  switch (imessage) {
    case bearMsg10001:
      msg = `${bearMsg10001Text} (${bearSchema}.${bearTable})`;
      break;
    case bearMsg10002:
      msg = `${bearMsg10002Text} (${bearSchema}.${bearTable})`;
      break;
    case bearMsg10003:
      msg = `${bearMsg10003Text} (${bearSchema}.${bearTable})`;
      break;
    case bearMsg10004:
      msg = `${bearMsg10004Text} (${imdata})`;
      break;
    case bearMsg10006:
      msg = `${bearMsg10006Text} (${imdata})`;
      break;
    case bearMsg10007:
      msg = `${bearMsg10007Text} (${imdata})`;
      break;
    default:
      msg = `${bearMsg19999Text} (${imessage})`;
      break;
  }
  const rsp = {
    ok: iok,
    status: istatus,
    message: msg,
    result: iresult,
  };
  callback(rsp);
};

const bearCallback200 = function (callback, iresult, imessage, imdata) {
  bearCallback(callback, true, 200, iresult, imessage, imdata);
};
const bearCallback201 = function (callback, iresult, imessage, imdata) {
  bearCallback(callback, true, 201, iresult, imessage, imdata);
};
const bearCallback404 = function (callback, iresult, imessage, imdata) {
  bearCallback(callback, false, 404, iresult, imessage, imdata);
};

// bear cache (150/hits/second to 2000+/hits/second)
// =============================================================================
const bearCacheList = 'deadbeef';
const bearCacheExpire = 3;

class BearCache {
  constructor() {
    this.cache = {};
    this.t1 = new Date();
  }

  expire() {
    // expire cache setting seconds
    const t2 = new Date();
    const difference = (t2 - this.t1) / 1000;
    if (difference > bearCacheExpire) {
      this.cache = {};
      this.t1 = new Date();
    }
  }

  add(key, query) {
    this.cache[key] = query;
  }

  exist(key) {
    this.expire(this);
    if (this.cache[key] === undefined) {
      return false;
    }
    return true;
  }

  find(key) {
    this.expire(this);
    if (this.cache[key] === undefined) {
      return null;
    }
    return this.cache[key];
  }
}
const bearCache = new BearCache();

// bear connection
// =============================================================================
class BearConn {
  constructor(idx) {
    this.conn = new idb.dbconn();
    // uses current user profile for DB2 connection
    this.conn.conn(database);
    this.inuse = false;
    this.schema = bearSchema;
    this.table = bearTable;
    this.idx = idx;
    this.stmt = new idb.dbstmt(this.conn);
  }

  free() {
    const newstmt = new idb.dbstmt(this.conn); // different stmt nbr than delete below (debug)
    if (this.stmt) {
      this.stmt.close();
    }
    this.stmt = newstmt;
  }

  detach() {
    this.free();
    this.inuse = false;
  }

  getInUse() {
    return this.inuse;
  }

  setInUse() {
    this.inuse = true;
  }
}

// bear connection pool
// =============================================================================
class BearPool {
  constructor() {
    this.pool = [];
    this.pmax = 0;
  }

  attach(callback) {
    const validConn = false;
    while (!validConn) {
      // find available connection
      for (let i = 0; i < this.pmax; i += 1) {
        const inuse = this.pool[i].getInUse();
        if (!inuse) {
          this.pool[i].setInUse();
          callback(this.pool[i]);
          return;
        }
      }
      // expand the connection pool
      let j = this.pmax;
      for (let i = 0; i < incrementSize; i += 1) {
        this.pool[j] = new BearConn(j);
        j += 1;
      }
      this.pmax += incrementSize;
    }
  }
}

class Bear {
  constructor() {
    this.bpool = new BearPool();
  }

  // select all rows bears.bear
  // Bear.find(function(response){});
  // GET        Read            200 (OK), list of customers. Use pagination,  200 (OK), single customer.
  //                                sorting and filtering to navigate         404 (Not Found), if ID not found or invalid.
  //                                big lists.
  find(callback) {
    const exist = bearCache.exist(bearCacheList);
    if (exist) {
      const found = bearCache.find(bearCacheList);
      if (found) {
        bearCallback200(callback, found, bearMsg10002, null);
      } else {
        bearCallback404(callback, false, bearMsg10003, null);
      }
      return;
    }
    this.bpool.attach((bconn) => {
      const sql = `select * from ${bconn.schema}.${bconn.table} order by name`;
      bconn.stmt.exec(sql, (result, error) => {
        bconn.detach();
        if (error) {
          bearCallback404(callback, false, bearMsg10001, null);
          return;
        }
        if (!result[0]) {
          bearCache.add(bearCacheList, false);
          bearCallback404(callback, false, bearMsg10003, null);
          return;
        }
        bearCache.add(bearCacheList, result);
        bearCallback200(callback, result, bearMsg10002, null);
      });
    });
  }

  // add row bears.bear
  // Bear.save(myname, function(response){});
  // POST       Create          201 (Created), 'Location' header with link    404 (Not Found).
  //                                to /customers/{id} containing new ID.     409 (Conflict) if resource already exists.
  save(myname, callback) {
    this.bpool.attach((bconn) => {
      let sql = `insert into ${bconn.schema}.${bconn.table} (NAME) VALUES('${myname}')`;
      bconn.stmt.exec(sql, (result, insertError) => {
        if (insertError) {
          bconn.detach();
          bearCallback404(callback, false, bearMsg10001, null);
          return;
        }
        bconn.free();
        sql = 'SELECT IDENTITY_VAL_LOCAL() FROM SYSIBM.SYSDUMMY1';
        bconn.stmt.exec(sql, (result2, deleteError) => {
          bconn.detach();
          if (deleteError) {
            bearCallback404(callback, false, bearMsg10001, null);
            return;
          }
          if (!result2[0]) {
            bearCallback201(callback, false, bearMsg10004, '?');
            return;
          }
          bearCallback201(callback, false, bearMsg10004, result2[0]['00001']);
        });
      });
    });
  }

  // select by id row bears.bear
  // Bear.findById(myid, function(response){});
  // GET        Read            200 (OK), list of customers. Use pagination,  200 (OK), single customer.
  //                                sorting and filtering to navigate         404 (Not Found), if ID not found or invalid.
  //                                big lists.
  findById(myid, callback) {
    const exist = bearCache.exist(myid);
    if (exist) {
      const found = bearCache.find(myid);
      if (found) {
        bearCallback200(callback, found, bearMsg10006, myid);
      } else {
        bearCallback404(callback, false, bearMsg10007, myid);
      }
      return;
    }
    this.bpool.attach((bconn) => {
      const sql = `select * from ${bconn.schema}.${bconn.table} where ID=${myid}`;
      bconn.stmt.exec(sql, (result, error) => {
        bconn.detach();
        if (error) {
          bearCallback404(callback, false, bearMsg10001, myid);
          return;
        }
        if (!result[0]) {
          bearCache.add(myid, false);
          bearCallback404(callback, false, bearMsg10007, myid);
          return;
        }
        bearCache.add(myid, result);
        bearCallback200(callback, result, bearMsg10006, myid);
      });
    });
  }

  // remove by id row bears.bear
  // Bear.removeById(myid, function(response){});
  // DELETE     Delete          404 (Not Found), unless you want to           200 (OK).
  //                                delete the whole collection               404 (Not Found), if ID not found or invalid.
  removeById(myid, callback) {
    this.bpool.attach((bconn) => {
      const sql = `select * from ${bconn.schema}.${bconn.table} where ID=${myid}`;
      bconn.stmt.exec(sql, (result, error) => {
        if (error) {
          bconn.detach();
          bearCallback404(callback, false, bearMsg10001, myid);
          return;
        }
        bconn.free();
        if (!result[0]) {
          bconn.detach();
          bearCallback404(callback, false, bearMsg10007, myid);
          return;
        }
        const sql2 = `delete from ${bconn.schema}.${bconn.table} where ID=${myid}`;
        bconn.stmt.exec(sql2, (deleteResult, deleteError) => {
          if (deleteError) {
            bconn.detach();
            bearCallback404(callback, false, bearMsg10001, myid);
            return;
          }
          bconn.detach();
          bearCallback200(callback, false, bearMsg10006, myid);
        });
      });
    });
  }

  // debug: expose BearPool
  // Bear.debugBearPool(function(pool){});
  debugBearPool(callback) {
    callback(this.bpool);
  }
}

exports.Bear = Bear;
exports.BearConn = BearConn;
exports.BearPool = BearPool;
