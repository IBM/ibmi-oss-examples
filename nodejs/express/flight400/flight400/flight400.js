/* eslint-disable new-cap */

const {
  iConn, iCmd, iPgm, iSql, xmlToJson,
} = require('itoolkit');

const conf = require('../config');

if (conf.user === '*NONE' || conf.password === '*NONE') {
  throw new Error('Ensure username and password are configured. View the README for more information');
}


class RestConn {
  constructor(idx) {
    this.inuse = false;
    this.idx = idx;
    this.conn = new iConn(conf.database, conf.user, conf.password,
      {
        host: conf.host,
        port: conf.port,
        path: conf.path,
        ipc: `/tmp/flight${this.idx}`,
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


class Flight400 {
  constructor() {
    this.rpool = new RestPool();
  }
  // ***************************************************
  // cities
  // ***************************************************

  // GetCityName(callback, initials, fromTo)
  // input:
  //   initials - "ABY", "HOU", ...
  //   fromTo   - "F", "T"
  // output:
  //   callback(city)
  //     city   - "Albany", "Houston", ..., "ERROR"
  GetCityName(callback, initials, fromTo) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d GetCityName     pr
      // d  Initials                      3    const
      // d  FromTo                        1    const
      // d  Name                         16
      const pgm = new iPgm('NFS400', { func: 'GETCITYNAME' });
      pgm.addParam(initials, '3A');
      pgm.addParam(fromTo, '1A');
      pgm.addParam('', '16A');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
      // console.log(str);
        const results = xmlToJson(str);
        let city = 'ERROR';
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parm3 = pgmResult.data[2];
          city = parm3.value;
          if (!city) {
            city = 'ERROR';
          }
        }
        rconn.detach();
        callback(city);
      });
    });
  }

  // FindFromCities(callback, position, listType, countReq)
  // input:
  //   position   - "Bi", "Fl", ...
  //   listType   - "S"-name, "M"-nam*, "N"-gt
  //   countReq   - 2
  // output:
  //   callback(cityinfo[])
  //     cityinfo[] - [
  //                  [Name,Initials,Airline],
  //                  ...
  //                 ]
  FindFromCities(callback, position, listType, countReq) {
    this.rpool.attach((rconn) => {
    // chglibl
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d CityInfo        ds                  qualified
      // d  Name                         16
      // d  Initials                      3
      // d  Airline                       3
      // d FindFromCities  pr
      // d  Position                     16    const
      // d  ListType                      1    const
      // d  CountReq                     10i 0 const
      // d  CountRet                     10i 0
      // d  CityList                           likeds(CityInfo) dim(100)
      // d                                     options(*varsize)
      const pgm = new iPgm('NFS400', { func: 'FINDFROMCITIES' });
      pgm.addParam(position, '16A');
      pgm.addParam(listType, '1A');
      pgm.addParam(countReq, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        ['', '16A'],
        ['', '3A'],
        ['', '3A'],
      ], { dim: 100, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const cityinfo = [];
        let info = [];
        //  const cmdResult = results[0];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore position, listType, countReq, CountRet
              if (i > 3) {
              // likeds(CityInfo) dim(100)
                info[j] = row.value;
                j += 1;
                if (j > 2) {
                  cityinfo[k] = info;
                  k += 1;
                  j = 0;
                  info = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(cityinfo);
      });
    });
  }

  // FindToCities(callback, position, listType, countReq)
  // input:
  //   position   - "Bi", "Fl", ...
  //   listType   - "S", "M", "N", ...
  //   countReq   - 2
  // output:
  //   callback(cityinfo[])
  //     cityinfo[] - [
  //                  [Name,Initials,Airline],
  //                  ...
  //                 ]
  FindToCities(callback, position, listType, countReq) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d CityInfo        ds                  qualified
      // d  Name                         16
      // d  Initials                      3
      // d  Airline                       3
      // d FindToCities  pr
      // d  Position                     16    const
      // d  ListType                      1    const
      // d  CountReq                     10i 0 const
      // d  CountRet                     10i 0
      // d  CityList                           likeds(CityInfo) dim(100)
      // d                                     options(*varsize)
      const pgm = new iPgm('NFS400', { func: 'FINDTOCITIES' });
      pgm.addParam(position, '16A');
      pgm.addParam(listType, '1A');
      pgm.addParam(countReq, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        ['', '16A'],
        ['', '3A'],
        ['', '3A'],
      ], { dim: 100, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const cityinfo = [];
        let info = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore position, listType, countReq, CountRet
              if (i > 3) {
              // likeds(CityInfo) dim(100)
                info[j] = row.value;
                j += 1;
                if (j > 2) {
                  cityinfo[k] = info;
                  k += 1;
                  j = 0;
                  info = [];
                }
              }
              i += 1;
            });
          } // else parms
        }
        rconn.detach();
        callback(cityinfo);
      });
    });
  }

  // GetFromCities(callback)
  // input:
  // output:
  //   callback(cityname[])
  //     cityname[] - [Albany, ... ]
  GetFromCities(callback) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      const sql = new iSql();
      const query = 'select CTYNAM from fcity';
      sql.addQuery(query);
      sql.fetch();
      sql.free();
      rconn.conn.add(sql);
      rconn.conn.run((str) => {
        let i = 0;
        const cityname = [];
        const results = xmlToJson(str);
        const sqlResult = results[1];
        if (sqlResult) {
          const rows = sqlResult.result;
          if (rows) {
            rows.forEach((cols) => {
              const c = cols[0];
              cityname[i] = c.value;
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(cityname);
      });
    });
  }

  // GetToCities(callback)
  // input:
  // output:
  //   callback(cityname[])
  //     cityname[] - [Albany, ... ]
  GetToCities(callback) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      const sql = new iSql();
      const query = 'select TTYNAM from tcity';
      sql.addQuery(query);
      sql.fetch();
      sql.free();
      rconn.conn.add(sql);
      rconn.conn.run((str) => {
        let i = 0;
        const cityname = [];
        const results = xmlToJson(str);
        const sqlResult = results[1];
        if (sqlResult) {
          const rows = sqlResult.result;
          if (rows) {
            rows.forEach((cols) => {
              const c = cols[0];
              cityname[i] = c.value;
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(cityname);
      });
    });
  }


  // ***************************************************
  // flights
  // ***************************************************

  // FindFlights(callback, fromCity, toCity, flightDate)
  // input:
  //   fromCity   - "Albany", "Houston", ...
  //   toCity     - "Albany", "Houston", ...
  //   flightDate - "08/20/17"
  // output:
  //   callback(flights[])
  //     flights[] - [
  //                  [Airline,Flight,DoW,DepartCity,ArriveCity,DepartTime,ArriveTime,Price],
  //                  ...
  //                 ]
  FindFlights(callback, fromCity, toCity, flightDate) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d FlightInfo      ds                  qualified
      // d  Airline                       3
      // d  Flight                        7
      // d  DoW                           2
      // d  DepartCity                    3
      // d  ArriveCity                    3
      // d  DepartTime                    8
      // d  ArriveTime                    8
      // d  Price                         3
      // d FindFlights     pr
      // d   FromCity                    16    const
      // d   ToCity                      16    const
      // d   FlightDate                   8    const
      // d   FlightCount                 10i 0
      // d   Flights                           likeds(FlightInfo) dim(50)
      const pgm = new iPgm('NFS400', { func: 'FINDFLIGHTS' });
      pgm.addParam(fromCity, '16A');
      pgm.addParam(toCity, '16A');
      pgm.addParam(flightDate, '8A');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        ['', '3A'],
        ['', '7A'],
        ['', '2A'],
        ['', '3A'],
        ['', '3A'],
        ['', '8A'],
        ['', '8A'],
        ['', '3A'],
      ], { dim: 50, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const flights = [];
        let flight = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore fromCity, toCity, flightDate, FlightCount
              if (i > 3) {
              // likeds(FlightInfo) dim(50)
                flight[j] = row.value;
                j += 1;
                if (j > 7) {
                  flights[k] = flight;
                  k += 1;
                  j = 0;
                  flight = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(flights);
      });
    });
  }

  // FindFlightsDoW(callback, fromCity, toCity, FlightDoW)
  // input:
  //   fromCity   - "Albany", "Houston", ...
  //   toCity     - "Albany", "Houston", ...
  //   FlightDoW  - "Sunday", "Monday", ...
  // output:
  //   callback(flights[])
  //     flights[] - [
  //                  [Airline,Flight,DoW,DepartCity,ArriveCity,DepartTime,ArriveTime,Price],
  //                  ...
  //                 ]
  FindFlightsDoW(callback, fromCity, toCity, FlightDoW) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d FlightInfo      ds                  qualified
      // d  Airline                       3
      // d  Flight                        7
      // d  DoW                           2
      // d  DepartCity                    3
      // d  ArriveCity                    3
      // d  DepartTime                    8
      // d  ArriveTime                    8
      // d  Price                         3
      // d FindFlightsDoW  pr
      // d   FromCity                    16    const
      // d   ToCity                      16    const
      // d   FlightDoW                   16    const
      // d   FlightCount                 10i 0
      // d   Flights                           likeds(FlightInfo) dim(50)
      const pgm = new iPgm('NFS400', { func: 'FINDFLIGHTSDOW' });
      pgm.addParam(fromCity, '16A');
      pgm.addParam(toCity, '16A');
      pgm.addParam(FlightDoW, '16A');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        ['', '3A'],
        ['', '7A'],
        ['', '2A'],
        ['', '3A'],
        ['', '3A'],
        ['', '8A'],
        ['', '8A'],
        ['', '3A'],
      ], { dim: 50, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const flights = [];
        let flight = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore fromCity, toCity, FlightDoW, FlightCount
              if (i > 3) {
              // likeds(FlightInfo) dim(50)
                flight[j] = row.value;
                j += 1;
                if (j > 7) {
                  flights[k] = flight;
                  k += 1;
                  j = 0;
                  flight = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(flights);
      });
    });
  }


  // GetFlightInfo(callback, flightNumber)
  // input:
  //   flightNumber - "7769972", '7701951', ...
  // output:
  //   callback(flight[])
  //     flight[Airline,Flight,DoW,DepartCity,ArriveCity,DepartTime,ArriveTime,Price]
  GetFlightInfo(callback, flightNumber) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d FlightInfo      ds                  qualified
      // d  Airline                       3
      // d  Flight                        7
      // d  DoW                           2
      // d  DepartCity                    3
      // d  ArriveCity                    3
      // d  DepartTime                    8
      // d  ArriveTime                    8
      // d  Price                         3
      // d GetFlightInfo   pr
      // d  FlightNumber                  7    const
      // d  FlightInfo                         likeds(FlightInfo)
      const pgm = new iPgm('NFS400', { func: 'GETFLIGHTINFO' });
      pgm.addParam(flightNumber, '7A');
      pgm.addParam([
        ['', '3A'],
        ['', '7A'],
        ['', '2A'],
        ['', '3A'],
        ['', '3A'],
        ['', '8A'],
        ['', '8A'],
        ['', '3A'],
      ]);
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const flight = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            parms.forEach((row) => {
            // ignore flightNumber
              if (i > 0) {
              // likeds(FlightInfo)
                flight[j] = row.value;
                j += 1;
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(flight);
      });
    });
  }


  // ***************************************************
  // customers
  // ***************************************************


  // FindCustomers(callback, position, listType, countReq)
  // input:
  //   position   - "Bi", "Fl", ...
  //   listType   - "S", "M", "N", ...
  //   countReq   - 2
  // output:
  //   callback(custinfo[])
  //     custinfo[] - [
  //                  [Name,Number],
  //                  ...
  //                 ]
  FindCustomers(callback, position, listType, countReq) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d CustInfo        ds                  qualified
      // d  Name                         64
      // d  Number                        9B 0
      // d FindCustomers   pr
      // d  Position                     64    const
      // d  ListType                      1    const
      // d  CountReq                     10i 0 const
      // d  CountRet                     10i 0
      // d  CustList                           likeds(CustInfo) dim(100)
      // d                                     options(*varsize)
      const pgm = new iPgm('NFS400', { func: 'FINDCUSTOMERS' });
      pgm.addParam(position, '64A');
      pgm.addParam(listType, '1A');
      pgm.addParam(countReq, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        ['', '64A'],
        [0, '10i0'],
      ], { dim: 100, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        console.log(str);
        const results = xmlToJson(str);
        console.log(results);
        const custinfo = [];
        let info = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore position, listType, countReq, CountRet
              if (i > 3) {
              // likeds(CustInfo) dim(100)
                info[j] = row.value;
                j += 1;
                if (j > 1) {
                  custinfo[k] = info;
                  k += 1;
                  j = 0;
                  info = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(custinfo);
      });
    });
  }

  // GetCustNumber(callback, findName)
  // input:
  //   findName   - "Akin, Allan", "Babcock, Adrian", ...
  // output:
  //   callback(Number)
  //     Number   - 4999, 8245, ..., -1
  GetCustNumber(callback, findName) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d GetCustNumber   pr
      // d   Name                        64    const
      // d   Number                       9B 0
      // d   Generate                     1    const options(*nopass)
      const pgm = new iPgm('NFS400', { func: 'GETCUSTNUMBER' });
      pgm.addParam(findName, '64A');
      pgm.addParam(99, '10i0');
      pgm.addParam('', '1A');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        let nbr = -1;
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parm2 = pgmResult.data[1];
          nbr = parm2.value;
          if (!nbr) {
            nbr = -1;
          }
        }
        rconn.detach();
        callback(nbr);
      });
    });
  }

  // GetCustName(callback, findNbr)
  // input:
  //   findNbr    - 4999, 8245, ...
  // output:
  //   callback(Name)
  //     Name     - "Akin, Allan", "Babcock, Adrian", ..., "ERROR"
  GetCustName(callback, findNbr) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d GetCustName     pr
      // d  Number                        9B 0 const
      // d  Name                         64
      const pgm = new iPgm('NFS400', { func: 'GETCUSTNAME' });
      pgm.addParam(findNbr, '10i0');
      pgm.addParam('', '64A');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        let nam = 'ERROR';
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parm2 = pgmResult.data[1];
          nam = parm2.value;
          if (!nam) {
            nam = 'ERROR';
          }
        }
        rconn.detach();
        callback(nam);
      });
    });
  }


  // ***************************************************
  // order - summary
  // ***************************************************

  // ComputePrice(callback, basePrice, serviceClass, tickets)
  // input:
  //   basePrice     - "199", ...
  //   serviceClass  - "F"-first, "B"-business, "C"-coach
  //   tickets       - 1, ...
  // output:
  //   callback(total[])
  //     total[Price, Tax, TotalDue]
  ComputePrice(callback, basePrice, serviceClass, tickets) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d ComputePrice    pr
      // d   BasePrice                    3    const
      // d   ServiceClass                 1    const
      // d   Tickets                      3  0 const
      // d   Price                      7  2
      // d   Tax                          5  2
      // d   TotalDue                     7  2
      const pgm = new iPgm('NFS001', { func: 'COMPUTEPRICE' });
      pgm.addParam(basePrice, '3A');
      pgm.addParam(serviceClass, '1A');
      pgm.addParam(tickets, '3p0');
      pgm.addParam(0.0, '7p2');
      pgm.addParam(0.0, '5p2');
      pgm.addParam(0.0, '7p2');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const total = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parm4 = pgmResult.data[3];
          const parm5 = pgmResult.data[4];
          const parm6 = pgmResult.data[5];
          if (parm4 && parm5 && parm6) {
            total[0] = parm4.value;
            total[1] = parm5.value;
            total[2] = parm6.value;
          }
        }
        rconn.detach();
        callback(total);
      });
    });
  }

  // FindOrderCust(callback, position, listType, countReq)
  // input:
  //   position   - "Bi", "Fl", ...
  //   listType   - "S", "M", "N", ...
  //   countReq   - 2
  // output:
  //   callback(orderinfo[])
  //     orderinfo[] - [
  //                  [OrderNumber, CustName, DepartDate],
  //                  ...
  //                 ]
  FindOrderCust(callback, position, listType, countReq) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d OrderSummary    ds                  qualified
      // d  OrderNumber                   9B 0
      // d  CustName                     64
      // d  DepartDate                    8
      // d FindOrderCust   pr
      // d  Position                     64    const
      // d  ListType                      1    const
      // d  CountReq                     10i 0 const
      // d  CountRet                     10i 0
      // d  OrderList                          likeds(OrderSummary) dim(100)
      const pgm = new iPgm('NFS001', { func: 'FINDORDERCUST' });
      pgm.addParam(position, '64A');
      pgm.addParam(listType, '1A');
      pgm.addParam(countReq, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        [0, '10i0'],
        ['', '64A'],
        ['', '8A'],
      ], { dim: 100, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const orderinfo = [];
        let info = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore position, listType, countReq, CountRet
              if (i > 3) {
              // likeds(OrderSummary) dim(100)
                info[j] = row.value;
                j += 1;
                if (j > 2) {
                  orderinfo[k] = info;
                  k += 1;
                  j = 0;
                  info = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(orderinfo);
      });
    });
  }

  // FindOrderDate(callback, position, listType, countReq)
  // input:
  //   position   - "", "", ...
  //   listType   - "S", "M"
  //   countReq   - 2
  // output:
  //   callback(orderinfo[])
  //     orderinfo[] - [
  //                  [OrderNumber, CustName, DepartDate],
  //                  ...
  //                 ]
  FindOrderDate(callback, position, listType, countReq) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d OrderSummary    ds                  qualified
      // d  OrderNumber                   9B 0
      // d  CustName                     64
      // d  DepartDate                    8
      // d FindOrderDate   pr
      // d  Position                      8    const
      // d  ListType                      1    const
      // d  CountReq                     10i 0 const
      // d  CountRet                     10i 0
      // d  OrderList                          likeds(OrderSummary) dim(100)
      const pgm = new iPgm('NFS001', { func: 'FINDORDERDATE' });
      pgm.addParam(position, '8A');
      pgm.addParam(listType, '1A');
      pgm.addParam(countReq, '10i0');
      pgm.addParam(0, '10i0', { enddo: 'count' });
      pgm.addParam([
        [0, '10i0'],
        ['', '64A'],
        ['', '8A'],
      ], { dim: 100, dou: 'count' });
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const orderinfo = [];
        let info = [];
        const pgmResult = results[1];
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            let i = 0;
            let j = 0;
            let k = 0;
            parms.forEach((row) => {
            // ignore position, listType, countReq, CountRet
              if (i > 3) {
              // likeds(OrderSummary) dim(100)
                info[j] = row.value;
                j += 1;
                if (j > 2) {
                  orderinfo[k] = info;
                  k += 1;
                  j = 0;
                  info = [];
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(orderinfo);
      });
    });
  }

  // ***************************************************
  // order - reservation
  // ***************************************************

  // GetOrderInfo(callback, orderNumber)
  // input:
  //   orderNumber     - 4971378, 4978226, ...
  // output:
  //   callback(resvinfo[])
  // resvinfo[AgentNumber, CustNumber, FlightNumber, DepartDate,
  // DepartTime, Tickets, ServiceClass, OrderNumber]
  GetOrderInfo(callback, orderNumber) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d ReserveInfo     ds                  qualified
      // d  AgentNumber                   9B 0
      // d  CustNumber                    9B 0
      // d  FlightNumber                  7
      // d  DepartDate                    8
      // d  DepartTime                    8
      // d  Tickets                       3  0
      // d  ServiceClass                1
      // d GetOrderInfo    pr
      // d  OrderNumber                   9B 0 const
      // d  OrderInfo                          likeds(ReserveInfo)
      const pgm = new iPgm('NFS001', { func: 'GETORDERINFO' });
      pgm.addParam(orderNumber, '10i0');
      pgm.addParam([
        [0, '10i0'],
        [0, '10i0'],
        ['', '7A'],
        ['', '8A'],
        ['', '8A'],
        [0, '3s0'],
        ['', '1A'],
      ]);
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        const resvinfo = [];
        const pgmResult = results[1];
        let i = 0;
        let j = 0;
        if (pgmResult.success) {
          const parms = pgmResult.data;
          if (parms) {
            parms.forEach((row) => {
            // ignore orderNumber
              if (i > 0) {
              // FLIGHT400 NSF001
              // d ConvertRecord   pi                  likeds(ReserveInfo)
              // OrderInfo.DepartDate = %char(%date(DEPART):*mdy);
              // OrderInfo.DepartTime = %char(%date(DEPART):*usa);
              // -- should be --
              // OrderInfo.DepartDate = %char(%date(DEPART):*mdy);
              // OrderInfo.DepartTime = %char(%time(DEPART):*usa); // need fix
              // likeds(ReserveInfo)
                resvinfo[j] = row.value;
                j += 1;
                if (j > 6) {
                  resvinfo[j] = orderNumber;
                  j += 1;
                }
              }
              i += 1;
            });
          }
        }
        rconn.detach();
        callback(resvinfo);
      });
    });
  }

  // ReserveFlight(callback, order)
  // input:
  //   order[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  // output:
  //   callback(OrderNumber)
  ReserveFlight(callback, order) {
    this.rpool.attach((rconn) => {
    // chglibl
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d ReserveInfo     ds                  qualified
      // d  AgentNumber                   9B 0
      // d  CustNumber                    9B 0
      // d  FlightNumber                  7
      // d  DepartDate                    8
      // d  DepartTime                    8
      // d  Tickets                       3  0
      // d  ServiceClass                1
      // d ReserveFlight   pr
      // d  OrderInfo                          likeds(ReserveInfo) const
      // d  OrderNumber                   9B 0
      const pgm = new iPgm('NFS001', { func: 'RESERVEFLIGHT' });
      pgm.addParam([
        [order[0], '10i0'],
        [order[1], '10i0'],
        [order[2], '7A'],
        [order[3], '8A'],
        [order[4], '8A'],
        [order[5], '3s0'],
        [order[6], '1A'],
      ]);
      pgm.addParam(0, '10i0');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        let orderNumber = -91;
        const pgmResult = results[1];
        if (pgmResult.success) {
          orderNumber = -92;
          if (pgmResult.data) {
            orderNumber = -93;
            const parm2 = pgmResult.data[7];
            if (parm2) {
              orderNumber = parm2.value;
            }
          }
        }
        rconn.detach();
        callback(orderNumber);
      });
    });
  }

  // UpdateOrder(callback, orderNumber, oldOrder, newOrder)
  // input:
  //  orderNumber     - 4971378, 4978226, ...
  //  oldOrder[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  //  newOrder[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  // output:
  //   callback(ReturnCode)
  UpdateOrder(callback, orderNumber, oldOrder, newOrder) {
    this.rpool.attach((rconn) => {
      rconn.conn.add(iCmd(`CHGLIBL LIBL(${conf.demoLib1} ${conf.demoLib2}) CURLIB(${conf.demoLib2})`));
      // d ReserveInfo     ds                  qualified
      // d  AgentNumber                   9B 0
      // d  CustNumber                    9B 0
      // d  FlightNumber                  7
      // d  DepartDate                    8
      // d  DepartTime                    8
      // d  Tickets                       3  0
      // d  ServiceClass                1
      // d UpdateOrder     pr
      // d  OrderNumber                   9B 0 const
      // d  OldOrder                           likeds(ReserveInfo) const
      // d  NewOrder                           likeds(ReserveInfo) const
      // d  ReturnCode                   10i 0
      const pgm = new iPgm('NFS001', { func: 'UPDATEORDER', error: 'on' });
      pgm.addParam(orderNumber, '10i0');
      pgm.addParam([
        [oldOrder[0], '10i0'],
        [oldOrder[1], '10i0'],
        [oldOrder[2], '7A'],
        [oldOrder[3], '8A'],
        [oldOrder[4], '8A'],
        [oldOrder[5], '3s0'],
        [oldOrder[6], '1A'],
      ]);
      pgm.addParam([
        [newOrder[0], '10i0'],
        [newOrder[1], '10i0'],
        [newOrder[2], '7A'],
        [newOrder[3], '8A'],
        [newOrder[4], '8A'],
        [newOrder[5], '3s0'],
        [newOrder[6], '1A'],
      ]);
      pgm.addParam(0, '10i0');
      rconn.conn.add(pgm);
      rconn.conn.run((str) => {
        const results = xmlToJson(str);
        let rc = -91;
        const pgmResult = results[1];
        if (pgmResult.success) {
          rc = -92;
          if (pgmResult.data) {
            rc = -93;
            const parm4 = pgmResult.data[3];
            if (parm4) {
              rc = parm4.value;
            }
          }
        }
        rconn.detach();
        callback(rc);
      });
    });
  }
}


// ***************************************************
// Flight400 - export
// ***************************************************

module.exports.Flight400 = Flight400;
