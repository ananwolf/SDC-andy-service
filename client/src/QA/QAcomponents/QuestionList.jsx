import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Question from './Question.jsx';
import MoreQuestions from './MoreQuestions.jsx';

const QuestionList = ({ searchInput, productId }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`/qa/questions/${productId}`)
      .then(response => {
        setQuestions(response.data.results
          .sort((a, b) => b.question_helpfulness - a.question_helpfulness));
      })
      .catch(err => console.log(err));
  }, [productId]);

  return (
    <div className='question-list' data-testid='qa-list-test'>
      {
        searchInput === null
          ?
          questions
            .slice(0, 5)
            .map((question, count) => (
              count > 3
                ? <MoreQuestions
                  questions={questions}
                  key={question.question_id}
                />
                : <Question
                  question={question}
                  productId={productId}
                  key={question.question_id} />
            ))
          :
          questions.filter(q => {
            if (q.question_body.toLowerCase()
              .includes(searchInput.toLowerCase())) {
              return q;
            }
          })
            .slice(0, 5)
            .map((question, count) => (
              count > 3
                ? <MoreQuestions
                  questions={questions}
                  key={question.question_id}
                />
                : <Question
                  question={question}
                  productId={productId}
                  key={question.question_id}
                />
            ))
      }
    </div>
  );
};

export default QuestionList;

