const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const moment = require('moment');
const books = require('./public/books.json');
const EventBridgeRepository = require('./repositories/EventBridge');
const PubSubRepository = require('./repositories/PubSub');


const PORT = process.env.PORT || 5000;
console.log("Application running with environment variables", process.env)

function createPromotionRepository(provider) {
  switch (provider) {
    case "GCP":
      return new PubSubRepository()
    case "AWS":
    default:
      return new EventBridgeRepository(process.env.EVENTBUS_NAME)
  }
}
const promotionRepository = createPromotionRepository(process.env.CLOUD_PROVIDER)

app.set('port', PORT);
app.use(bodyParser.json())

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-requested-with, origin, content-type, accept');
  next();
 });

app.get('/', function(request, response) {
  response.send('Bienvenue dans la librairie de Henri Potier');
});

const BOOKS = books;
const BOOKS_BY_ISBN = _.indexBy(BOOKS, 'isbn');
const ISBNS = _.keys(BOOKS_BY_ISBN);


app.get('/health', function(request, response) {
  response.json({"status": "up"});
});

app.get('/books', function(request, response) {
  response.json(BOOKS);
});

app.get('/books/:ids/promotions', function (request, response) {
  const ids = _.map(request.params.ids.split(','), function(s) {
    return s.trim();
  });

  const matchingIds = _.filter(ids, function(id) {
    return _.contains(ISBNS, id);
  });

  const baseReduction = moment().hour() > 12 ? 4 : 5;
  const booksCount = matchingIds.length;

  let offers = [];
  if (booksCount < 2) {
    offers = [
      {type:"percentage", value: baseReduction}
    ];
  } else if (booksCount >= 2 && booksCount < 4) {
    offers = [
      {type:"percentage", value: baseReduction},
	    {type:"minus", value: 15},
      {type:"slice", sliceValue: 100, value: 12}
    ];
  } else {
    offers = [
      {type:"percentage", value: baseReduction * 2},
      {type:"minus", value: 30},
      {type:"slice", sliceValue: 80, value: 14}
    ];
  }

  response.json({offers:offers});
});


app.post('/promotions', async function(request, response) {
  const promo = request.body;
  console.log("Create promotion", promo);

  var isEmpty = !Object.keys(promo).length;
  if(isEmpty) {
    response.status(400).json({"error": "Empty promotion"})
  }

  await promotionRepository.sendPromotion(promo)
  response.json({"message": "promotion created"});
});



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
