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
  FOREIGN KEY (answer_id) REFERENCES answers (id)
);

COPY answers_photos(id, answer_id, photo_url)
FROM '/Users/ananwolf/Desktop/SDC-DB/answers_photos.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/ananwolf/Desktop/SDC-DB/answers.csv'
DELIMITER ','
CSV HEADER;



FROM '/Users/ananwolf/Desktop/SDC-DB/questions.csv'
DELIMITER ','


db.collection.updateMany(
  { id: { $eq: answer_id }}
)