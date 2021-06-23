-- DROP DATABASE IF EXISTS questionsAnswers;

-- CREATE DATABASE questionsAnswers;

CREATE TABLE questions (
  id SERIAL,
  product_id SERIAL,
  body VARCHAR(1000),
  date_written DATE,
  asker_name VARCHAR(60),
  asker_email TEXT,
  reported BOOLEAN,
  helpful SMALLINT,
  PRIMARY KEY (id)
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id SERIAL,
  body VARCHAR(1000),
  date_written TIMESTAMP,
  answerer_name VARCHAR,
  answerer_email TEXT,
  reported BOOLEAN,
  helpful SMALLINT,
  FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id SERIAL,
  photo_url TEXT,
  FOREIGN KEY (answers_id) REFERENCES answers (id)
);