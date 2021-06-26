
import React from 'react';
import AnswerPhotos from './AnswerPhotos.jsx';
import AnswerHelpful from './AnswerHelpful.jsx';

const Answers = ({ answer }) => (
  <div className='answer-div' data-testid='answer-list-test'>
    <div className='answer'>A: {answer.body}</div>
    <div className='photo-div'>
      {answer.photos.length ? answer.photos.map((photo, id) => (
        <AnswerPhotos photo={photo.url} key={id} />
      )) : null}
    </div>
    <AnswerHelpful
      answerId={answer.id}
      answerHelpfulness={answer.helpfulness}
      answerDate={answer.date}
      answerName={answer.answerer_name}
    />
  </div>
);

export default Answers;