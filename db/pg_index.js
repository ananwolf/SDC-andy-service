const pg = require('pg');
const PASS = require('../config.js');

const pool = new pg.Pool({
  user: 'ananwolf',
  host: 'localhost',
  database: 'questionsanswers',
  password: PASS,
  port: 5432
});

pool.connect();

const fetchQuestions = (prodId) =>
  pool.query('SELECT * FROM questions WHERE product_id = $1;', [prodId])
    .then(data => {
      let questionData = data.rows;
      let promisedAnswers = questionData.map(question => {
        return fetchAnswers(question.question_id);
      });
      return Promise.all(promisedAnswers)
        .then(data => {
          return questionData.map((question, index) => {
            return { ...question, answers: data[index] };
          });
        });
    })
    .catch(err => console.log(err));

const fetchAnswers = (questionId) =>
  pool.query('SELECT * FROM answers WHERE question_id = $1;', [questionId])
    .then(data => {
      let answerData = data.rows;
      let promisedPhotos = answerData.map((answer) =>
        fetchPhotos(answer.id)
      );
      return Promise.all(promisedPhotos)
        .then(photo => {
          let answerObj = {};
          answerData.forEach((answer, index) => {
            answerObj[answer.id] = {
              id: answer.id,
              body: answer.body,
              date: answer.date,
              answerer_name: answer.answerer_name,
              helpfulness: answer.helpfulness,
              photos: photo[index]
            };
          });
          return answerObj;
        });
    })
    .catch(err => console.log(err));

const fetchPhotos = (answerId) =>
  pool.query('SELECT * FROM answers_photos WHERE answer_id = $1', [answerId])
    .then(data => {
      let photoData = data.rows;
      let mappedData = photoData.map(photo => {
        return {
          id: photo.id,
          url: photo.photo_url
        };
      });
      return mappedData;
    })
    .catch(err => console.log(err));

module.exports = {
  fetchQuestions
};
