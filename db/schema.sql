-- DROP DATABASE IF EXISTS questionsAnswers;

-- CREATE DATABASE questionsAnswers;

CREATE TABLE questions (
  question_id SERIAL,
  product_id SERIAL,
  question_body VARCHAR(1000),
  question_date DATE,
  asker_name VARCHAR(60),
  asker_email TEXT,
  reported BOOLEAN,
  question_helpfulness SMALLINT,
  PRIMARY KEY (question_id)
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id SERIAL,
  body VARCHAR(1000),
  date DATE,
  answerer_name VARCHAR,
  answerer_email TEXT,
  reported BOOLEAN,
  helpfulness SMALLINT,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id SERIAL,
  photo_url TEXT,
  FOREIGN KEY (answer_id) REFERENCES answers (id)
);

COPY answers_photos(id, answer_id, photo_url)
FROM '/Users/ananwolf/Desktop/ETL/answers_photos.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
FROM '/Users/ananwolf/Desktop/ETL/answers.csv'
DELIMITER ','
CSV HEADER;

COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM '/Users/ananwolf/Desktop/ETL/questions.csv'
DELIMITER ','
CSV HEADER;


db.collection.updateMany(
  { id: { $eq: answer_id }}
)