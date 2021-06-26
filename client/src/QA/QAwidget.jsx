import React, { useState, useEffect } from 'react';
import Search from './QAcomponents/Search.jsx';
import QuestionList from './QAcomponents/QuestionList.jsx';
import AddQuestion from './QAcomponents/AddQuestion.jsx';

const QAwidget = ( { productId } ) => {
  const [searchInput, setSearchInput] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = (searchInput) => {
    searchInput.length > 2
      ? setSearchInput(searchInput)
      : setSearchInput('');
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  return (
    <>
      <div className='qa-widget'>
        <h1 className='qa-header'>Questions &amp; Answers</h1>
        <Search
          handleSearch={handleSearch}
          searchInput={searchInput}
        />

        <QuestionList
          productId={productId}
          searchInput={searchInput}
        />

        <button className='add-question-button' onClick={handleModalOpen}>
          ADD A QUESTION +
        </button>
        <AddQuestion
          productId={productId}
          openModal={openModal}
          handleModalClose={handleModalClose}
        />
      </div>
    </>
  );
};

export default QAwidget;