const express = require('express');
const bodyParser = require('body-parser');
const { hostname } = require('os');
const { XmlServiceProvider } = require('./xmlserviceprovider');

const app = express();

app.use('/silly_public', express.static(`${__dirname}/public`)); // setup static public directory
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`); // optional since express defaults to CWD/views
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const xmlserviceProvider = new XmlServiceProvider();

const port = process.env.PORT || 47720;

const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
  next();
});

// ROUTES FOR OUR API

router.get('/', (req, res) => {
  xmlserviceProvider.HatsCat(
    (result) => {
      res.render('index', { title: 'select hat group', items: result });
    },
  );
});

router.get('/cat', (req, res) => {
  const { key } = req.query;
  xmlserviceProvider.HatsPgmCat(
    (result) => {
      res.render('cat', { title: 'select your hats', items: result });
    },
    key,
  );
});


router.get('/big', (req, res) => {
  const { key } = req.query;
  const chat = null;
  xmlserviceProvider.HatsDetail(
    (result) => {
      res.render('big', { title: 'hat information', item: result });
    },
    key, chat,
  );
});

router.post('/big', (req, res) => {
  const key = req.body.prod;
  const { chat } = req.body;
  xmlserviceProvider.HatsDetail(
    (result) => {
      res.render('big', { title: 'hat information', item: result });
    },
    key, chat,
  );
});

// REGISTER OUR ROUTES
app.use('/', router);

// START THE SERVER
app.listen(port, () => {
  console.log(`Server running at:\nhttp://${hostname()}:${port}`);
});
