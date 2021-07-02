const pg = require('pg');
const { PASS } = require('../config.js');

const pool = new pg.Pool({
  user: 'ananwolf',
  host: 'localhost',
  database: 'questionsanswers',
  password: PASS,
  port: 5432,
  max: 95
});

pool.connect();

// GET QUESTIONS
const fetchQuestions = (prodId) =>
  pool.query('SELECT question_id, question_body, question_date, asker_name, reported, question_helpfulness FROM questions WHERE product_id = $1 AND reported = false;', [prodId])
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
    .catch(err => err);

const fetchAnswers = (questionId) =>
  pool.query('SELECT id, body, date, answerer_name, reported, helpfulness FROM answers WHERE question_id = $1 AND reported = false;', [questionId])
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
              /* eslint-disable */
              answerer_name: answer.answerer_name,
              /* eslint-enable */
              helpfulness: answer.helpfulness,
              photos: photo[index]
            };
          });
          return answerObj;
        });
    })
    .catch(err => err);

const fetchPhotos = (answerId) =>
  pool.query('SELECT id, photo_url FROM answers_photos WHERE answer_id = $1', [answerId])
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
    .catch(err => err);

// POST QUESTION
const postQuestion = (productId, body, askerName, askerEmail) =>
  pool.query('INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES($1, $2, CURRENT_DATE, $3, $4, false, 0)', [productId, body, askerName, askerEmail])
    .then(data => console.log(data, 'at data post db'))
    .catch(err => console.log(err, 'at post question db'));

// POST ANSWER
const postAnswer = (questionId, body, answererName, answererEmail, photos) =>
  pool.query('INSERT INTO answers (question_id, body, date, answerer_name, answerer_email, reported, helpfulness) VALUES($1, $2, CURRENT_DATE, $3, $4, false, 0)', [questionId, body, answererName, answererEmail])
    .then(() => {
      if (photos.length) {
        return pool.query('SELECT MAX(id) FROM answers')
          .then(data => {
            let answerId = data.rows[0].max;
            return pool.query('INSERT INTO answers_photos (answer_id, photo_url) VALUES($1, $2)', [answerId, photos[0]])
              .then(() => console.log('succesful photo post'))
              .catch(err => console.log(err, 'at photo adding'));
          });
      }
    })
    .catch(err => console.log(err, 'at post answer db'));

const putQuestionHelpful = (questionId) =>
  pool.query('UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1', [questionId])
    .then(() => console.log('question helpful + 1 succesful'))
    .catch(err => console.log(`err updating helpfulness question ${err}`));

const putAnswerHelpful = (answerId) =>
  pool.query('UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1', [answerId])
    .then(() => console.log('answer helpful + 1 succesful'))
    .catch(err => console.log(`err updating helpfulness answer ${err}`));

const putAnswerReport = (answerId) =>
  pool.query('UPDATE answers SET reported = true WHERE id = $1', [answerId])
    .then(() => console.log('answer reported succesful'))
    .catch(err => console.log(`err updating helpfulness answer ${err}`));


module.exports = {
  fetchQuestions,
  postQuestion,
  postAnswer,
  putQuestionHelpful,
  putAnswerHelpful,
  putAnswerReport
};