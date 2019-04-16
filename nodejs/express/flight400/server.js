/* eslint-disable max-len */
const express = require('express'); // call express

const app = express();
const api = express.Router();

const bodyParser = require('body-parser');
const { hostname } = require('os');
const { FlightJson400 } = require('./flight400/flightjson400');

const flight400 = new FlightJson400();
const port = process.env.PORT || 47700; // set our port

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// configure static directory
app.use('/assets', express.static(`${__dirname}/view`));

// serve up webpage frontend
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/view/index.html`);
});

// middleware to use for all requests
api.use((req, res, next) => {
  next();
});

// ROUTES FOR OUR API
// =============================================================================
// GET:/flight400/api
//--------------------
// http://myibmi/flight400/api
// {"message":"hooray! welcome to our api!"}
api.get('/', (req, res) => res.send({ message: 'hooray! welcome to our api!' }));

//--------------------
// GET:/flight400/api/city
//--------------------

// GET:/flight400/api/city/initials
// http://myibmi/flight400/api/city/hou
// {"ok":true,"status":200,"message":"found (HOU-T)","result":"Houston"}
// http://myibmi/flight400/api/city/bad
// {"ok":false,"status":404,"message":"not found (BAD-T)","result":false}
api.route('/city/:initials')
  .get((req, res) => {
    const initials = req.params.initials.toUpperCase();
    const fromTo = 'T';
    flight400.GetCityName((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    initials,
    fromTo);
  });
// GET:/flight400/api/city/initials/from|to
// http://myibmi/flight400/api/city/hou/from
// {"ok":true,"status":200,"message":"found (HOU-F)","result":"Houston"}
// http://myibmi/flight400/api/city/bad/to
// {"ok":false,"status":404,"message":"not found (BAD-F)","result":false}
api.route('/city/:initials/:fromTo')
  .get((req, res) => {
    const initials = req.params.initials.toUpperCase();
    const fromTo = req.params.fromTo.substring(0, 1).toUpperCase();
    flight400.GetCityName((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    initials, fromTo);
  });

//--------------------
// GET:/flight400/api/cities
//--------------------

// GET:/flight400/api/cities/Alba
// http://myibmi/flight400/api/cities/Alb
// {"ok":true,"status":200,"message":"found (Alb-f-12)","result":[
// {"city":"Albany","initials":"ABY","airline":"AMA"},
// {"city":"Albuquerque","initials":"ALB","airline":"UNI"},
// {"city":"Anchorage","initials":"ANC","airline":"NWA"},
// {"city":"Atlanta","initials":"ATL","airline":"DLT"},
// {"city":"Atlantic City","initials":"ATC","airline":"UNI"},
// {"city":"Baltimore","initials":"BLT","airline":"DLT"},
// {"city":"Billings","initials":"BLL","airline":"UNI"},
// {"city":"Birmingham","initials":"BRM","airline":"CON"},
// {"city":"Bismarck","initials":"BMK","airline":"NWA"},
// {"city":"Boise","initials":"BOS","airline":"NWA"},
// {"city":"Boston","initials":"BST","airline":"DLT"},
// {"city":"Bozeman","initials":"BOZ","airline":"UNI"}
// ]}
api.route('/cities/:position')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'S';
    const countReq = 12;
    const fromTo = 'F';
    if (fromTo === 'F') {
      flight400.FindFromCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    } else {
      flight400.FindToCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    }
  });

// GET:/flight400/api/cities/Alba/from|to
// http://myibmi/flight400/api/cities/Alba/to
// {"ok":true,"status":200,"message":"found (Alba-t-12)","result":[
// {"city":"Albany","initials":"ABY","airline":null},
// {"city":"Albuquerque","initials":"ALB","airline":null},
// {"city":"Anchorage","initials":"ANC","airline":null},
// {"city":"Atlanta","initials":"ATL","airline":null},
// {"city":"Atlantic City","initials":"ATC","airline":null},
// {"city":"Baltimore","initials":"BLT","airline":null},
// {"city":"Billings","initials":"BLL","airline":null},
// {"city":"Birmingham","initials":"BRM","airline":null},
// {"city":"Bismarck","initials":"BMK","airline":null},
// {"city":"Boise","initials":"BOS","airline":null},
// {"city":"Boston","initials":"BST","airline":null},
// {"city":"Bozeman","initials":"BOZ","airline":null}
// ]}
//
// GET:/flight400/api/cities/Alba/2
// http://myibmi/flight400/api/cities/Alba/2
// {"ok":true,"status":200,"message":"found (Alba-f-2)","result":[
// {"city":"Albany","initials":"ABY","airline":"AMA"},
// {"city":"Albuquerque","initials":"ALB","airline":"UNI"}
// ]}
api.route('/cities/:position/:fromTo')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'S';
    let countReq = 12;
    let fromTo = 'F';
    const num = parseInt(req.params.fromTo, 10) || 0;
    if (num) {
      countReq = num;
    } else {
      fromTo = req.params.fromTo.substring(0, 1).toUpperCase();
    }
    if (fromTo === 'F') {
      flight400.FindFromCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    } else {
      flight400.FindToCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    }
  });
// GET:/flight400/api/cities/Alba/3/from|to
// http://myibmi/flight400/api/cities/Alba/3/from
// {"ok":true,"status":200,"message":"found (Alba-f-3)","result":[
// {"city":"Albany","initials":"ABY","airline":"AMA"},
// {"city":"Albuquerque","initials":"ALB","airline":"UNI"},
// {"city":"Anchorage","initials":"ANC","airline":"NWA"}
// ]}
api.route('/cities/:position/:countReq/:fromTo')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'S';
    const { countReq } = req.params;
    const fromTo = req.params.fromTo.substring(0, 1).toUpperCase();
    if (fromTo === 'F') {
      flight400.FindFromCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    } else {
      flight400.FindToCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      position, listType, countReq);
    }
  });

// GET:/flight400/api/all/from|to
// http://myibmi/flight400/api/all/from
// {"ok":true,"status":200,"message":"found (f)","result":[
// {"city":"Albany"},
// {"city":"Albuquerque"},
// :
// {"city":"Winnipeg"}]}
api.route('/all/:fromTo')
  .get((req, res) => {
    const fromTo = req.params.fromTo.substring(0, 1).toUpperCase();
    if (fromTo === 'F') {
      flight400.GetFromCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      });
    } else {
      flight400.GetToCities((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      });
    }
  });

//--------------------
// GET:/flight400/api/flights
//--------------------

// GET:/flight400/api/flights/cityfrom/cityto
// http://myibmi/flight400/api/flights/Albany/Houston
// {"ok":true,"status":200,"message":"found (Albany-Houston-07/27/17)","result":[
// {"airline":"AMA","flight":"4101918","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"07:19 AM","timeto":"09:19 AM","price":"169"},
// {"airline":"AMA","flight":"4201919","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"08:22 AM","timeto":"10:22 AM","price":"179"},
// {"airline":"AMA","flight":"4301920","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"09:24 AM","timeto":"11:24 AM","price":"199"},
// {"airline":"AMA","flight":"4401921","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"10:27 AM","timeto":"12:27 PM","price":"199"},
// {"airline":"AMA","flight":"4501922","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"11:41 AM","timeto":"01:41 PM","price":"299"},
// {"airline":"AMA","flight":"4601923","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"01:19 PM","timeto":"03:19 PM","price":"299"},
// {"airline":"AMA","flight":"4701924","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"02:47 PM","timeto":"04:47 PM","price":"299"},
// {"airline":"AMA","flight":"4801925","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"04:48 PM","timeto":"06:48 PM","price":"269"},
// {"airline":"AMA","flight":"4901926","dow":"Th","cityfrom":"ABY","cityto":"HOU","timefrom":"06:36 PM","timeto":"08:36 PM","price":"199"}
// ]}
// http://myibmi/flight400/api/flights/Bad/Houston
// {"ok":false,"status":404,"message":"not found (Bad-Houston-07/27/17)","result":false}
api.route('/flights/:fromCity/:toCity')
  .get((req, res) => {
    const { fromCity } = req.params;
    const { toCity } = req.params;
    // 2017-07-14
    // 0123456789
    const now = new Date().toISOString().substring(0, 10);
    const dd = now.substring(8, 10);
    const mm = now.substring(5, 7);
    const yy = now.substring(2, 4);
    const flightDate = `${mm}/${dd}/${yy}`;
    flight400.FindFlights((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    fromCity, toCity, flightDate);
  });
// GET:/flight400/api/flights/cityfrom/cityto/mm/dd
// http://myibmi/flight400/api/flights/Albany/Houston/08/20
// {"ok":true,"status":200,"message":"found (Albany-Houston-08/20/17)","result":[
// {"airline":"AMA","flight":"7101945","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"07:19 AM","timeto":"09:19 AM","price":"169"},
// {"airline":"AMA","flight":"7201946","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"08:22 AM","timeto":"10:22 AM","price":"179"},
// {"airline":"AMA","flight":"7301947","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"09:24 AM","timeto":"11:24 AM","price":"199"},
// {"airline":"AMA","flight":"7401948","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"10:27 AM","timeto":"12:27 PM","price":"199"},
// {"airline":"AMA","flight":"7501949","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"11:41 AM","timeto":"01:41 PM","price":"299"},
// {"airline":"AMA","flight":"7601950","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"01:19 PM","timeto":"03:19 PM","price":"299"},
// {"airline":"AMA","flight":"7701951","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"02:47 PM","timeto":"04:47 PM","price":"299"},
// {"airline":"AMA","flight":"7801952","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"04:48 PM","timeto":"06:48 PM","price":"269"},
// {"airline":"AMA","flight":"7901953","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"06:36 PM","timeto":"08:36 PM","price":"199"}
// ]}
api.route('/flights/:fromCity/:toCity/:mm/:dd')
  .get((req, res) => {
    const { fromCity } = req.params;
    const { toCity } = req.params;
    // 2017-07-14
    // 0123456789
    const now = new Date().toISOString().substring(0, 10);
    const { dd } = req.params;
    const { mm } = req.params;
    const yy = now.substring(2, 4);
    const flightDate = `${mm}/${dd}/${yy}`;
    flight400.FindFlights((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    fromCity, toCity, flightDate);
  });
// GET:/flight400/api/flights/cityfrom/cityto/mm/dd/yy
// http://myibmi/flight400/api/flights/Albany/Houston/08/20/17
// {"ok":true,"status":200,"message":"found (Albany-Houston-08/20/17)","result":[
// {"airline":"AMA","flight":"7101945","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"07:19 AM","timeto":"09:19 AM","price":"169"},
// {"airline":"AMA","flight":"7201946","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"08:22 AM","timeto":"10:22 AM","price":"179"},
// {"airline":"AMA","flight":"7301947","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"09:24 AM","timeto":"11:24 AM","price":"199"},
// {"airline":"AMA","flight":"7401948","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"10:27 AM","timeto":"12:27 PM","price":"199"},
// {"airline":"AMA","flight":"7501949","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"11:41 AM","timeto":"01:41 PM","price":"299"},
// {"airline":"AMA","flight":"7601950","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"01:19 PM","timeto":"03:19 PM","price":"299"},
// {"airline":"AMA","flight":"7701951","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"02:47 PM","timeto":"04:47 PM","price":"299"},
// {"airline":"AMA","flight":"7801952","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"04:48 PM","timeto":"06:48 PM","price":"269"},
// {"airline":"AMA","flight":"7901953","dow":"Su","cityfrom":"ABY","cityto":"HOU","timefrom":"06:36 PM","timeto":"08:36 PM","price":"199"}
// ]}
api.route('/flights/:fromCity/:toCity/:mm/:dd/:yy')
  .get((req, res) => {
    const { fromCity } = req.params;
    const { toCity } = req.params;
    const { dd } = req.params;
    const { mm } = req.params;
    const { yy } = req.params;
    const flightDate = `${mm}/${dd}/${yy}`;
    flight400.FindFlights((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    fromCity, toCity, flightDate);
  });

//--------------------
// GET:/flight400/api/flight
//--------------------

// GET:/flight400/api/flight/nbr
// http://myibmi/flight400/api/flight/7769972
// {"ok":true,"status":200,"message":"found (flight-7769972)",
// "result":{"airline":"DLT","flight":"7769972","dow":"Su","cityfrom":"HOU","cityto":"ABY","timefrom":"02:33 PM","timeto":"04:33 PM","price":"299"}
// }
// http://myibmi/flight400/api/flight/4132425
// {"ok":false,"status":404,"message":"not found (flight-4132425)","result":false}
api.route('/flight/:flightNumber')
  .get((req, res) => {
    const { flightNumber } = req.params;
    flight400.GetFlightInfo((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    flightNumber);
  });


//--------------------
// GET:/flight400/api/customers
//--------------------

// GET:/flight400/api/customers/name
// http://myibmi/flight400/api/customers/Bi
// {"ok":true,"status":200,"message":"found (Bi-S-12)","result":[
// {"customer":"Bianco, Dawn","custid":"9706"},{"customer":"Bianco, Hurch","custid":"3963"},
// {"customer":"Bianco, Lonnie","custid":"9808"},{"customer":"Bickle, Darold","custid":"5014"},
// {"customer":"Bickle, Erna","custid":"9715"},{"customer":"Bickle, Steve","custid":"7788"},
// {"customer":"Biddison, Epifanio","custid":"5240"},{"customer":"Biddison, Joanne","custid":"40"},
// {"customer":"Biddison, Ruthetta","custid":"8732"},{"customer":"Biddison, Willis","custid":"8257"},
// {"customer":"Bielefeldt, Gerd","custid":"3810"},{"customer":"Bielefeldt, Jacqueline","custid":"6062"}
// ]}
api.route('/customers/:position')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'S';
    const countReq = 12;
    flight400.FindCustomers((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });
// GET:/flight400/api/customers/name/nbr
// http://myibmi/flight400/api/customers/Bi/2
// {"ok":true,"status":200,"message":"found (Bi-S-2)","result":[
// {"customer":"Bianco, Dawn","custid":"9706"},
// {"customer":"Bianco, Hurch","custid":"3963"}
// ]}
api.route('/customers/:position/:countReq')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'S';
    const { countReq } = req.params;
    flight400.FindCustomers((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });

//--------------------
// GET:/flight400/api/customer
//--------------------

// GET:/flight400/api/customer/nbr
// http://myibmi/flight400/api/customer/4999
// {"ok":true,"status":200,"message":"found (findNbr-4999)","result":"Haarstad, Efrain"}
// http://myibmi/flight400/api/customer/46575
// {"ok":false,"status":404,"message":"not found (findNbr-46575)","result":false}
//
// GET:/flight400/api/customer/Spicer, Diane
// http://myibmi/flight400/api/customer/Spicer, Diane
// {"ok":true,"status":200,"message":"found (findName-Spicer, Diane)","result":"6"}
// http://myibmi/flight400/api/customer/Wilbur
// {"ok":true,"status":200,"message":"found (findName-Wilbur)","result":"-1"}
api.route('/customer/:find')
  .get((req, res) => {
    const { find } = req.params;
    const num = parseInt(find, 10) || 0;
    if (num) {
      const findNbr = num;
      flight400.GetCustName((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      findNbr);
    } else {
      const findName = find;
      flight400.GetCustNumber((rsp) => {
        res.statusCode = rsp.status;
        return res.json(rsp);
      },
      findName);
    }
  });


//--------------------
// GET:/flight400/api/price
//--------------------

// GET:/flight400/api/price/baseprice
// http://myibmi/flight400/api/price/199
// {"ok":true,"status":200,"message":"found (price-199-C-1)","result":{"price":"199.00","tax":"7.96","total":"206.96"}}
api.route('/price/:basePrice')
  .get((req, res) => {
    const { basePrice } = req.params;
    const serviceClass = 'C';
    const tickets = 1;
    flight400.ComputePrice((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    basePrice, serviceClass, tickets);
  });
// GET:/flight400/api/price/baseprice/coach|business|first
// http://myibmi/flight400/api/price/199/coach
// {"ok":true,"status":200,"message":"found (price-199-C-1)","result":{"price":"199.00","tax":"7.96","total":"206.96"}}
//
// GET:/flight400/api/price/baseprice/nbrtickets
// http://myibmi/flight400/api/price/199/2
// {"ok":true,"status":200,"message":"found (price-199-C-2)","result":{"price":"398.00","tax":"15.92","total":"413.92"}}
api.route('/price/:basePrice/:serviceClass')
  .get((req, res) => {
    const { basePrice } = req.params;
    let serviceClass = 'C';
    let tickets = 1;
    const num = parseInt(req.params.serviceClass, 10) || 0;
    if (num) {
      tickets = num;
    } else {
      serviceClass = req.params.serviceClass.substring(0, 1).toUpperCase();
    }
    flight400.ComputePrice((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    basePrice, serviceClass, tickets);
  });
// GET:/flight400/api/price/baseprice/coach|business|first/nbrtickets
// http://myibmi/flight400/api/price/199/coach/3
// {"ok":true,"status":200,"message":"found (price-199-C-3)","result":{"price":"597.00","tax":"23.88","total":"620.88"}}
api.route('/price/:basePrice/:serviceClass/:tickets')
  .get((req, res) => {
    const { basePrice } = req.params;
    const serviceClass = req.params.serviceClass.substring(0, 1).toUpperCase();
    let tickets = 1;
    const num = parseInt(req.params.tickets, 10) || 0;
    if (num) {
      tickets = num;
    }
    flight400.ComputePrice((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    basePrice, serviceClass, tickets);
  });


//--------------------
// GET:/flight400/api/orders
//--------------------

// GET:/flight400/api/orders/name
// http://myibmi/flight400/api/orders/Bi
// {"ok":true,"status":200,"message":"found (Bi-M-12)","result":[
// {"order":"4970343","customer":"Bianco, Dawn","depart":"06/18/04"},
// {"order":"4971985","customer":"Bianco, Dawn","depart":"03/10/04"},
// {"order":"4980253","customer":"Bianco, Dawn","depart":"02/11/04"},
// {"order":"5003197","customer":"Bianco, Dawn","depart":"12/17/04"},
// {"order":"5003607","customer":"Bianco, Dawn","depart":"12/04/04"},
// {"order":"5020259","customer":"Bianco, Dawn","depart":"04/03/04"},
// {"order":"5030631","customer":"Bianco, Dawn","depart":"04/09/04"},
// {"order":"5033896","customer":"Bianco, Dawn","depart":"06/18/04"},
// {"order":"5036850","customer":"Bianco, Dawn","depart":"03/20/04"},
// {"order":"5039160","customer":"Bianco, Dawn","depart":"03/20/04"},
// {"order":"5056490","customer":"Bianco, Dawn","depart":"06/18/04"},
// {"order":"5059491","customer":"Bianco, Dawn","depart":"10/08/04"}
// ]}
// http://myibmi/flight400/api/orders/BAD
// {"ok":false,"status":404,"message":"not found (BAD-M-12)","result":false}
api.route('/orders/:position')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'M';
    const countReq = 12;
    flight400.FindOrderCust((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });
// GET:/flight400/api/orders/name/nbr
// http://myibmi/flight400/api/orders/Bi/3
// {"ok":true,"status":200,"message":"found (Bi-M-3)","result":[
// {"order":"4970343","customer":"Bianco, Dawn","depart":"06/18/04"},
// {"order":"4971985","customer":"Bianco, Dawn","depart":"03/10/04"},
// {"order":"4980253","customer":"Bianco, Dawn","depart":"02/11/04"}
// ]}
// http://myibmi/flight400/api/orders/BAD/3
// {"ok":false,"status":404,"message":"not found (BAD-M-3)","result":false}
api.route('/orders/:position/:countReq')
  .get((req, res) => {
    const { position } = req.params;
    const listType = 'M';
    let countReq = 12;
    const num = parseInt(req.params.countReq, 10) || 0;
    if (num) {
      countReq = num;
    }
    flight400.FindOrderCust((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });

// GET:/flight400/api/orders/mm/dd/yy
// http://myibmi/flight400/api/orders/03/11/04
// {"ok":true,"status":200,"message":"found (03/11/04-S-12)","result":[
// {"order":"4971378","customer":"Kiss, Arvester","depart":"03/11/04"},
// {"order":"4978226","customer":"Merriman, Dawn","depart":"03/11/04"},
// {"order":"4983029","customer":"Wozniak, Hurshal","depart":"03/11/04"},
// {"order":"4988749","customer":"Penny, Nolan","depart":"03/11/04"},
// {"order":"4990505","customer":"Devine, Jared","depart":"03/11/04"},
// {"order":"4993871","customer":"Penny, Nolan","depart":"03/11/04"},
// {"order":"4994273","customer":"Norles, Charmaine","depart":"03/11/04"},
// {"order":"4994745","customer":"Golz, Emery","depart":"03/11/04"},
// {"order":"4998261","customer":"Norles, Charmaine","depart":"03/11/04"},
// {"order":"4999445","customer":"Griesman, Shelby","depart":"03/11/04"},
// {"order":"5003281","customer":"Strom, Karla","depart":"03/11/04"},
// {"order":"5003627","customer":"Glenn, Adrian","depart":"03/11/04"}
// ]}
// http://myibmi/flight400/api/orders/03/11/29
// {"ok":false,"status":404,"message":"not found (03/11/29-S-12)","result":false}
api.route('/orders/:mm/:dd/:yy')
  .get((req, res) => {
    const listType = 'S';
    const countReq = 12;
    const { dd } = req.params;
    const { mm } = req.params;
    const { yy } = req.params;
    const position = `${mm}/${dd}/${yy}`;
    flight400.FindOrderDate((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });
// GET:/flight400/api/orders/mm/dd/yy/nbr
// http://myibmi/flight400/api/orders/03/11/04/3
// {"ok":true,"status":200,"message":"found (03/11/04-S-3)","result":[
// {"order":"4971378","customer":"Kiss, Arvester","depart":"03/11/04"},
// {"order":"4978226","customer":"Merriman, Dawn","depart":"03/11/04"},
// {"order":"4983029","customer":"Wozniak, Hurshal","depart":"03/11/04"}
// ]}
// http://myibmi/flight400/api/orders/03/11/29/3
// {"ok":false,"status":404,"message":"not found (03/11/29-S-3)","result":false}
api.route('/orders/:mm/:dd/:yy/:countReq')
  .get((req, res) => {
    const listType = 'S';
    let countReq = 12;
    const { dd } = req.params;
    const { mm } = req.params;
    const { yy } = req.params;
    const position = `${mm}/${dd}/${yy}`;
    const num = parseInt(req.params.countReq, 10) || 0;
    if (num) {
      countReq = num;
    }
    flight400.FindOrderDate((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    position, listType, countReq);
  });


//--------------------
// GET:/flight400/api/order
//--------------------

// GET:/flight400/api/order/nbr
// http://myibmi/flight400/api/order/4971378
// "ok":true,"status":200,"message":"found (order-4971378)",
// "result":{"agent":"2","custid":"9340","flight":"4113661","datefrom":"03/11/04","timefrom":"07:05 AM","tickets":"1","service":"C","order":"4971378"}
// }
// http://myibmi/flight400/api/order/497535
// {"ok":false,"status":404,"message":"not found (order-497535)","result":false}
api.route('/order/:orderNumber')
  .get((req, res) => {
    const { orderNumber } = req.params;
    flight400.GetOrderInfo((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    orderNumber);
  });


//--------------------
// POST:/flight400/api/reserve
//--------------------

// POST
// http://myibmi/flight400/api/reserve
// req.body
// {"agent":"1","custid":"9340","flight":"4113661","datefrom":"03/11/04","timefrom":"07:05 AM","tickets":"1","service":"C"}
api.route('/reserve')
  .post((req, res) => {
    const obj = req.body;
    const order = [
      obj.agent,
      obj.custid,
      obj.flight,
      obj.datefrom,
      obj.timefrom,
      obj.tickets,
      obj.service,
    ];
    flight400.ReserveFlight((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    order);
  });


//--------------------
// POST:/flight400/api/update
// (un-tested)
//--------------------

// POST
// http://myibmi/flight400/api/update
// req.body
// {"nbr":4978226,
// "now":{"agent":"2","custid":"9340","flight":"4113661","datefrom":"03/11/04","timefrom":"07:05 AM","tickets":"1","service":"C"},
// "chg":{"agent":"6","custid":"9340","flight":"4107172","datefrom":"03/11/04","timefrom":"07:05 AM","tickets":"1","service":"C"}
// }
api.route('/reserve')
  .post((req, res) => {
    const obj = JSON.parse(req.body.order);
    const orderNumber = obj.nbr;
    const oldOrder = [
      obj.now.agent,
      obj.now.custid,
      obj.now.flight,
      obj.now.datefrom,
      obj.now.timefrom,
      obj.now.tickets,
      obj.now.service,
    ];
    const newOrder = [
      obj.chg.agent,
      obj.chg.custid,
      obj.chg.flight,
      obj.chgc.datefrom,
      obj.chg.timefrom,
      obj.chg.tickets,
      obj.chg.service,
    ];
    flight400.ReserveFlight((rsp) => {
      res.statusCode = rsp.status;
      return res.json(rsp);
    },
    orderNumber, oldOrder, newOrder);
  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /flight400/api
app.use('/flight400/api', api);

// START THE SERVER
// =============================================================================
app.listen(port, () => {
  console.log(`Server running at:\nhttp://${hostname()}:${port}`);
});
