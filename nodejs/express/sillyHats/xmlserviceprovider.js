/* eslint-disable new-cap */
// xmlservice - REST connection (IBM node.js toolkit PTF)
const {
  iConn, iCmd, iPgm, iSql, xmlToJson,
} = require('itoolkit');

const conf = require('./config');

if (conf.user === '*NONE' || conf.password === '*NONE') {
  throw new Error('Ensure username and password are configured. View the README for more information');
}

// Rest connection
// =============================================================================
class RestConn {
  constructor(idx) {
    this.inuse = false;
    this.idx = idx;
    this.conn = new iConn(conf.database, conf.user, conf.password,
      {
        host: conf.host,
        port: conf.port,
        path: conf.path,
        ipc: `/tmp/silly${this.idx}`,
        ctl: '*sbmjob',
      });
  }

  getInUse() {
    return this.inuse;
  }

  setInUse() {
    this.inuse = true;
  }

  detach() {
    this.inuse = false;
  }
}

// Rest connection pool
// =============================================================================
class RestPool {
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
      for (let i = 0; i < 5; i += 1) {
        this.pool[j] = new RestConn(j);
        j += 1;
      }
      this.pmax += 5;
    }
  }
}
// XMLSERVICE
// =============================================================================
class XmlServiceProvider {
  constructor() {
    this.rpool = new RestPool();
  }

  HatsCat(callback) {
    this.rpool.attach((rconn) => {
      const sql = new iSql();
      sql.addQuery('SELECT DISTINCT CAT FROM PRODUCTS');
      sql.fetch();
      sql.free();
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib}) CURLIB(${conf.demoLib})`));
      rconn.conn.add(sql.toXML());
      // run (call xmlservice)
      rconn.conn.run((str) => {
        const jobj = xmlToJson(str);
        console.log(jobj);
        const list = [];
        jobj[1].result.forEach((row) => {
          let cat = '';
          let pic = conf.demoAsset;
          let dsc = '';
          switch (row[0].value) {
            case '1':
              cat = row[0].value;
              pic += 'pic_baby_soft.png';
              dsc = 'baby';
              break;
            case '2':
              cat = row[0].value;
              pic += 'pic_young_style.png';
              dsc = 'youth';
              break;
            case '3':
              cat = row[0].value;
              pic += 'pic_adult_best.png';
              dsc = 'adult';
              break;
            case '4':
              cat = row[0].value;
              pic += 'pic_animal_dog.png';
              dsc = 'animal';
              break;
            default:
              cat = row[0].value;
              pic += 'pic_adult_ufo.png';
              dsc = 'other';
              break;
          }
          list.push([cat, dsc, pic]);
        });
        rconn.detach();
        callback(list);
      });
    });
  }

  HatsDetail(callback, p1, p2) {
    this.rpool.attach((rconn) => {
    // change libl
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib}) CURLIB(${conf.demoLib})`));
      const sql = new iSql();
      // add chat ?
      if (p2) {
        sql.addQuery(`INSERT INTO CHAT (PROD, CHAT) VALUES(${p1},'${p2}')`);
        sql.free();
      }
      // chat back?
      sql.addQuery(`SELECT CHAT FROM CHAT WHERE PROD = ${p1}`);
      sql.fetch({ error: 'fast' });
      sql.free();
      // select product
      sql.addQuery(`SELECT * FROM PRODUCTS WHERE PROD = ${p1}`);
      sql.fetch({ error: 'fast' });
      sql.free();
      // complete xml document (input/request)
      const xmlIn = sql.toXML();
      rconn.conn.add(xmlIn);
      // run (call xmlservice)
      rconn.conn.run((str) => {
        const jobj = xmlToJson(str);
        console.log(jobj);
        let prod = 0;
        let cat = 0;
        let desc = '';
        let photo = '';
        let price = 0;
        let chatback = '';
        if (jobj && jobj[1] && jobj[1].result) {
          jobj[1].result.forEach((row) => {
            if (row[0].desc === 'CHAT') {
              chatback += `\n: ${row[0].value}`;
            } else {
              prod = row[0].value;
              cat = row[1].value;
              desc = row[2].value;
              photo = conf.demoAsset + row[3].value;
              price = row[4].value;
            }
          });
        }
        // return to screen
        rconn.detach();
        callback([prod, cat, desc, photo, price, chatback]);
      });
    });
  }

  HatsPgmCat(callback, p1) {
    this.rpool.attach((rconn) => {
    // chglibl
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib}) CURLIB(${conf.demoLib})`));
      // prepare iPgm Class
      const pgm = new iPgm('PRODUCT', { lib: conf.demoLib });
      pgm.addParam(p1, '10i0');
      pgm.addParam(20, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        [0, '10i0'],
        [0, '10i0'],
        [0, '64a', { varying: 4 }],
        [0, '64a', { varying: 4 }],
        [0, '12p2'],
      ], { dim: 999, dou: 'count' });
      rconn.conn.add(pgm.toXML());
      // run (call xmlservice)
      rconn.conn.run((str) => {
        const jobj = xmlToJson(str);
        console.log(jobj);
        const list = [];
        let i = 0;
        let j = 0;
        let prod = '';
        let cat = '';
        let desc = '';
        let photo = '';
        let price = '';
        jobj[1].data.forEach((row) => {
          if (i > 2) {
            j += 1;
            switch (j) {
              case 1:
                prod = row.value;
                break;
              case 2:
                cat = row.value;
                break;
              case 3:
                desc = row.value;
                break;
              case 4:
                photo = conf.demoAsset + row.value;
                break;
              case 5:
                price = row.value;
                list.push([prod, cat, desc, photo, price]);
                j = 0;
                break;
              default:
                j = 0;
                break;
            }
          }
          i += 1;
        });
        rconn.detach();
        callback(list);
      });
    });
  }
}

exports.XmlServiceProvider = XmlServiceProvider;
