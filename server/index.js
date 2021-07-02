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

/* -------- QUESTION & ANSWER -------- */
const {
  fetchQuestions,
  postQuestion,
  postAnswer,
  putQuestionHelpful,
  putAnswerHelpful,
  putAnswerReport
} = require('../db/pg_index.js');

app.get('/qa/questions/:productId', (req, res) => {
  let productId = req.params.productId;
  fetchQuestions(productId)
    .then((data) => {
      let promisedData = {
        /* eslint-disable */
        product_id: productId,
        /* eslint-enable */
        results: data
      };
      res.status(200).send(promisedData);
    })
    .catch(err => res.status(404).send(`error fetching questions ${err}`));
});

app.post('/qa/questions', (req, res) => {
  postQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(`err at post question server ${err}`));
});

app.post('/qa/questions/:question_id/answer', (req, res) => {
  postAnswer(req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(`err at post answer server ${err}`));
});

app.put('/question/:question_id/helpful', (req, res) => {
  let questionId = req.params.question_id;
  putQuestionHelpful(questionId)
    .then(response => res.status(204).send(response))
    .catch(err => res.status(400).send(`err at PUT question helpful ${err}`));
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let answerId = req.params.answer_id;
  putAnswerHelpful(answerId)
    .then(response => res.status(204).send(response))
    .catch(err => res.status(400).send(`err at PUT answer helpful ${err}`));
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  let answerId = req.params.answer_id;
  putAnswerReport(answerId)
    .then(response => res.status(204).send(response))
    .catch(err => res.status(400).send(`err at PUT answer report ${err}`));
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