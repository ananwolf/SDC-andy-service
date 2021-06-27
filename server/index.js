const express = require('express');
const APIToken = require('../config.js');
const axios = require('axios');
const compression = require('compression');
let app = express();

// adding middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(compression());


app.use(express.static(__dirname + '/../client/dist'));

/* -------- PRODUCT OVERVIEW FETCHING -------- */
app.get('/overview', function (req, res) {
  let productId = req.query.productId;
  axios.all([
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    }),
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}/styles`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    })
  ])
    .then(axios.spread((detail, styles) => {
      var product = {
        overview: detail.data,
        styles: styles.data
      };
      var stringedProduct = JSON.stringify(product);
      res.status(200).send(stringedProduct);
    }))
    .catch((err) => {
      console.log('get overview error:' + err);
      res.send(404);
    });
});

/* -------- ADD TO CART POST REQUEST -------- */
app.post('/addToCart', (req, res) => {
  const skuId = Number(req.body.skuId);

  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/cart', {
    'sku_id': skuId
  }, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  });

  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/cart', {'sku_id': skuId}, {headers: { Authorization: APIToken.TOKEN}})

    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

/* -------- QUESTION & ANSWER -------- */
const { fetchQuestions } = require('../db/pg_index.js');

app.get('/qa/questions', (req, res) => {
  let productId = req.query.productId;
  fetchQuestions(productId)
    .then((data) => {
      let promisedData = {
        product_id: productId,
        results: data
      };
      res.status(200).send(promisedData);
    })
    .catch(err => res.status(404).send(`error fetching questions ${err}`));
  // axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/qa/questions?product_id=${productId}&count=15`, {
  //   headers: {
  //     Authorization: APIToken.TOKEN
  //   }
  // })
  //   .then(response => res.status(200).json(response.data))
  //   .catch(err => res.status(400).send('Error while fetching Q&A'));
});

app.post('/qa/questions', (req, res) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/qa/questions', req.body, {headers: { Authorization: APIToken.TOKEN }})
    .then(response => {
      res.status(201).send(response.data);
    })
    .catch(err => res.status(400).send(`Err adding question, server side ${err}`));
});

app.post('/qa/questions/answer', (req, res) => {
  let questionId = req.body.questionId;
  axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/qa/questions/${questionId}/answers`, req.body, {headers: { Authorization: APIToken.TOKEN }})
    .then(response => {
      res.status(201).send(response.data);
    })
    .catch(err => res.status(400).send(`Err adding answer, server side ${err}`));
});

app.put('/question/helpful', (req, res) => {
  let questionId = req.body.questionId;
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/qa/questions/${questionId}/helpful`, null, {headers: { Authorization: APIToken.TOKEN }})
    .then(response => res.status(204))
    .catch(err => {
      res.status(400).send('Error updating helpful status');
    });
});

app.put('/qa/questions/answer/helpful', (req, res) => {
  let answerId = req.body.answerId;
  let type = req.body.type;
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/qa/answers/${answerId}/${type}`, null, {headers: { Authorization: APIToken.TOKEN }})
    .then(response => res.status(204))
    .catch(err => {
      res.status(400).send('Error updating helpful status');
    });
});

/* -------- RELATED PRODUCT FETCHING -------- */
app.get('/relatedIds', function (req, res) {
  let productId = req.query.productId;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}/related`, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(400).send('Error while fetching related Ids');
    });
});

app.get('/relatedProduct', function (req, res) {
  let productId = req.query.productId;
  axios.all([
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    }),
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}/styles`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    }),
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/products/${productId}/related`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    }),
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/meta/?product_id=${productId}`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    })
  ])
    .then(axios.spread((obj1, obj2, obj3, obj4) => {
      var product = {
        overview: obj1.data,
        styles: obj2.data,
        relatedIds: obj3.data,
        meta: obj4.data
      };
      res.status(200).json(product);
    }))
    .catch((err) => {
      console.log('getall error:' + err);
      res.send(404);
    });
});
/************REVIEWS************/

app.get('/fetchReviews', (req, res) => {
  let productId = req.query.productId;
  for (var i = 1; i < 2; i++) {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/?product_id=${productId}&count=50&page=${i}`, {
      headers: {
        Authorization: APIToken.TOKEN
      }
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
        res.send(404);
      });
  }
});

app.get('/helpfulReview', (req, res) => {
  let productId = req.query.productId;
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/${productId}/helpful`, 'placeHolder', {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.send(200);
    });
});
/************METADATA ************/
//Helper for Below
var calculateAverage = function (object) {
  var sum = 0;
  var quant = 0;
  for (var key in object) {
    sum = sum + (Number(key) * Number(object[key]));
    quant += Number(object[key]);
  }
  var number = sum / quant;
  return Number((Math.round(number * 4) / 4).toFixed(2));
};

//Pass through some productId and you will get returned an average rating for it rounded to the nearest 0.25
app.get('/getAverageRating', (req, res) => {
  let productId = req.query.productId;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/meta/?product_id=${productId}`, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.status(200).json(calculateAverage(response.data.ratings));
    })
    .catch((err) => {
      res.send(404);
    });
});

app.get('/getNumberOfReviews', function (req, res) {
  let productId = req.query.productId;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/?product_id=${productId}&count=50`, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.send(JSON.stringify(response.data.results.length));
    })
    .catch((err) => {
      res.send(404);
    });
});

app.post('/submitReview', (req, res) => {
  console.log(req.body);
  res.send(200);
});

app.get('/fetchMeta', (req, res) => {
  let productId = req.query.productId;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/meta/?product_id=${productId}`, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.send(response.data);
    });
});

app.get('/fetchCurrentCharacteristics', (req, res) => {
  let productId = req.query.productId;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/reviews/meta/?product_id=${productId}`, {
    headers: {
      Authorization: APIToken.TOKEN
    }
  })
    .then((response) => {
      res.send(response.data);
    });
});


/************Interactions************/
app.post('/tracking', (req, res) => {
  // console.log(JSON.stringify(req.body));
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sjo/interactions', req.body, {headers: { Authorization: APIToken.TOKEN }})
    .then(response => {
      res.status(201).json(response.data);
    })
    .catch(err => res.status(422).send(`Err adding question, server side ${err}`));
});

/************Port************/
let PORT = process.env.PORT || 1128;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});