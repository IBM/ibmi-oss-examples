/* eslint-disable camelcase */
/* eslint-disable max-len */
const { Flight400 } = require('./flight400');

// flight400 response
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
const flight400_msg_10004 = 10004;
const flight400_msg_10004_text = 'insert success';
const flight400_msg_10006 = 10006;
const flight400_msg_10006_text = 'found';
const flight400_msg_10007 = 10007;
const flight400_msg_10007_text = 'not found';
const flight400_msg_19999_text = 'message not available';

const flight400_callback = (callback, iok, istatus, iresult, imessage, imdata) => {
  let msg = '';
  switch (imessage) {
    case flight400_msg_10004:
      msg = `${flight400_msg_10004_text} (${imdata})`;
      break;
    case flight400_msg_10006:
      msg = `${flight400_msg_10006_text} (${imdata})`;
      break;
    case flight400_msg_10007:
      msg = `${flight400_msg_10007_text} (${imdata})`;
      break;
    default:
      msg = `${flight400_msg_19999_text} (${imessage})`;
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

const flight400_callback_200 = (callback, iresult, imessage, imdata) => {
  flight400_callback(callback, true, 200, iresult, imessage, imdata);
};

const flight400_callback_201 = (callback, iresult, imessage, imdata) => {
  flight400_callback(callback, true, 201, iresult, imessage, imdata);
};

const flight400_callback_404 = (callback, iresult, imessage, imdata) => {
  flight400_callback(callback, false, 404, iresult, imessage, imdata);
};


class FlightJson400 {
  constructor() {
    this.flight400 = new Flight400();
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
    this.flight400.GetCityName(
      (city) => {
        let result = false;
        if (city && city !== 'ERROR') {
          result = city;
          flight400_callback_200(callback, result, flight400_msg_10006, `${initials}-${fromTo}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${initials}-${fromTo}`);
        }
      },
      initials, fromTo,
    );
  }

  // FindFromCities(callback, position, listType, countReq)
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
  FindFromCities(callback, position, listType, countReq) {
    this.flight400.FindFromCities(
      (cityinfo) => {
        let result = false;
        if (cityinfo && cityinfo[0]) {
          result = [];
          cityinfo.forEach(
            (info) => {
              result.push({ city: info[0], initials: info[1], airline: info[2] });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${position}-f-${countReq}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${position}-f-${countReq}`);
        }
      },
      position, listType, countReq,
    );
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
    this.flight400.FindToCities(
      (cityinfo) => {
        let result = false;
        if (cityinfo && cityinfo[0]) {
          result = [];
          cityinfo.forEach(
            (info) => {
              result.push({ city: info[0], initials: info[1], airline: null });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${position}-t-${countReq}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${position}-t-${countReq}`);
        }
      },
      position, listType, countReq,
    );
  }

  // GetFromCities(callback)
  // input:
  // output:
  //   callback(cityname[])
  //     cityname[] - [Albany, ... ]
  GetFromCities(callback) {
    this.flight400.GetFromCities(
      (cityname) => {
        // eslint-disable-next-line no-var
        let result = false;
        if (cityname && cityname[0]) {
          result = [];
          cityname.forEach(
            (info) => {
              result.push({ city: info });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, 'f');
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, 'f');
        }
      },
    );
  }

  // GetToCities(callback)
  // input:
  // output:
  //   callback(cityname[])
  //     cityname[] - [Albany, ... ]
  GetToCities(callback) {
    this.flight400.GetToCities(
      (cityname) => {
        let result = false;
        if (cityname && cityname[0]) {
          result = [];
          cityname.forEach(
            (info) => {
              result.push({ city: info });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, 't');
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, 't');
        }
      },
    );
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
    this.flight400.FindFlights(
      (flights) => {
        let result = false;
        if (flights && flights[0]) {
          result = [];
          flights.forEach(
            (info) => {
              result.push({
                airline: info[0], flight: info[1], dow: info[2], cityfrom: info[3], cityto: info[4], timefrom: info[5], timeto: info[6], price: info[7],
              });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${fromCity}-${toCity}-${flightDate}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${fromCity}-${toCity}-${flightDate}`);
        }
      },
      fromCity, toCity, flightDate,
    );
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
    this.flight400.FindFlightsDoW(
      (flights) => {
        let result = false;
        if (flights && flights[0]) {
          result = [];
          flights.forEach(
            (info) => {
              result.push({
                airline: info[0], flight: info[1], dow: info[2], cityfrom: info[3], cityto: info[4], timefrom: info[5], timeto: info[6], price: info[7],
              });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${fromCity}-${toCity}-${FlightDoW}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${fromCity}-${toCity}-${FlightDoW}`);
        }
      },
      fromCity, toCity, FlightDoW,
    );
  }


  // GetFlightInfo(callback, flightNumber)
  // input:
  //   flightNumber - "7769972", '7701951', ...
  // output:
  //   callback(flight[])
  //     flight[Airline,Flight,DoW,DepartCity,ArriveCity,DepartTime,ArriveTime,Price]
  GetFlightInfo(callback, flightNumber) {
    this.flight400.GetFlightInfo(
      (info) => {
        let result = false;
        if (info && info[0]) {
          result = {
            airline: info[0], flight: info[1], dow: info[2], cityfrom: info[3], cityto: info[4], timefrom: info[5], timeto: info[6], price: info[7],
          };
          flight400_callback_200(callback, result, flight400_msg_10006, `flight-${flightNumber}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `flight-${flightNumber}`);
        }
      },
      flightNumber,
    );
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
    this.flight400.FindCustomers(
      (custinfo) => {
        let result = false;
        if (custinfo && custinfo[0]) {
          result = [];
          custinfo.forEach(
            (info) => {
              result.push({ customer: info[0], custid: info[1] });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${position}-${listType}-${countReq}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${position}-${listType}-${countReq}`);
        }
      },
      position, listType, countReq,
    );
  }

  // GetCustNumber(callback, findName)
  // input:
  //   findName   - "Akin, Allan", "Babcock, Adrian", ...
  // output:
  //   callback(Number)
  //     Number   - 4999, 8245, ..., -1
  GetCustNumber(callback, findName) {
    this.flight400.GetCustNumber(
      (info) => {
        let result = false;
        if (info) {
          result = info;
          flight400_callback_200(callback, result, flight400_msg_10006, `findName-${findName}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `findName-${findName}`);
        }
      },
      findName,
    );
  }

  // GetCustName(callback, findNbr)
  // input:
  //   findNbr    - 4999, 8245, ...
  // output:
  //   callback(Name)
  //     Name     - "Akin, Allan", "Babcock, Adrian", ..., "ERROR"
  GetCustName(callback, findNbr) {
    this.flight400.GetCustName(
      (info) => {
        let result = false;
        if (info && info !== 'ERROR') {
          result = info;
          flight400_callback_200(callback, result, flight400_msg_10006, `findNbr-${findNbr}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `findNbr-${findNbr}`);
        }
      },
      findNbr,
    );
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
    this.flight400.ComputePrice(
      (info) => {
        let result = false;
        if (info && info[0]) {
          result = { price: info[0], tax: info[1], total: info[2] };
          flight400_callback_200(callback, result, flight400_msg_10006, `price-${basePrice}-${serviceClass}-${tickets}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `price-${basePrice}-${serviceClass}-${tickets}`);
        }
      },
      basePrice, serviceClass, tickets,
    );
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
    this.flight400.FindOrderCust(
      (orderinfo) => {
        let result = false;
        if (orderinfo && orderinfo[0]) {
          result = [];
          orderinfo.forEach(
            (info) => {
              result.push({ order: info[0], customer: info[1], depart: info[2] });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${position}-${listType}-${countReq}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${position}-${listType}-${countReq}`);
        }
      },
      position, listType, countReq,
    );
  }

  // FindOrderDate(callback, position, listType, countReq)
  // input:
  //   position   - "03/11/04", ...
  //   listType   - "S", "M"
  //   countReq   - 2
  // output:
  //   callback(orderinfo[])
  //     orderinfo[] - [
  //                  [OrderNumber, CustName, DepartDate],
  //                  ...
  //                 ]
  FindOrderDate(callback, position, listType, countReq) {
    this.flight400.FindOrderDate(
      (orderinfo) => {
        let result = false;
        if (orderinfo && orderinfo[0]) {
          result = [];
          orderinfo.forEach(
            (info) => {
              result.push({ order: info[0], customer: info[1], depart: info[2] });
            },
          );
          flight400_callback_200(callback, result, flight400_msg_10006, `${position}-${listType}-${countReq}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `${position}-${listType}-${countReq}`);
        }
      },
      position, listType, countReq,
    );
  }

  // ***************************************************
  // order - reservation
  // ***************************************************

  // GetOrderInfo(callback, orderNumber)
  // input:
  //   orderNumber     - 4971378, 4978226, ...
  // output:
  //   callback(resvinfo[])
  //     resvinfo[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass, OrderNumber]
  GetOrderInfo(callback, orderNumber) {
    this.flight400.GetOrderInfo(
      (info) => {
        let result = false;
        if (info && info[2]) {
          result = {
            agent: info[0], custid: info[1], flight: info[2], datefrom: info[3], timefrom: info[4], tickets: info[5], service: info[6], order: info[7],
          };
          flight400_callback_200(callback, result, flight400_msg_10006, `order-${orderNumber}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `order-${orderNumber}`);
        }
      },
      orderNumber,
    );
  }

  // ReserveFlight(callback, order)
  // input:
  //   order[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  // output:
  //   callback(OrderNumber)
  ReserveFlight(callback, order) {
    this.flight400.ReserveFlight(
      (nbr) => {
        let result = false;
        if (nbr > 0) {
          result = nbr;
          flight400_callback_201(callback, result, flight400_msg_10004_text, `custid-${order[1]}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `custid-${order[1]}`);
        }
      },
      order,
    );
  }

  // UpdateOrder(callback, orderNumber, oldOrder, newOrder)
  // input:
  //   orderNumber     - 4971378, 4978226, ...
  //   oldOrder[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  //   newOrder[AgentNumber, CustNumber, FlightNumber, DepartDate, DepartTime, Tickets, ServiceClass]
  // output:
  //   callback(ReturnCode)
  UpdateOrder(callback, orderNumber, oldOrder, newOrder) {
    this.flight400.UpdateOrder(
      (nbr) => {
        let result = false;
        if (nbr > 0) {
          result = nbr;
          flight400_callback_201(callback, result, flight400_msg_10004_text, `custid-${newOrder[1]}`);
        } else {
          flight400_callback_404(callback, result, flight400_msg_10007, `custid-${newOrder[1]}`);
        }
      },
      orderNumber, oldOrder, newOrder,
    );
  }
}


// ***************************************************
// FlightJson400 - export
// ***************************************************

exports.FlightJson400 = FlightJson400;
