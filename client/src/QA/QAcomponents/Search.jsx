import React, { useState } from 'react';

const Search = ({ handleSearch }) => {

  const handleFocus = (event) => {
    event.preventDefault();
    const { target } = event;
    target.setSelectionRange(0, target.value.length);
  };

  return (
    <div className='qa-search' data-testid='search-test'>
      <form>
        <input
          className='qa-search-bar'
          placeholder='Search for answers...'
          onChange={event => handleSearch(event.target.value)}
          onFocus={handleFocus}></input>
      </form>
    </div>
  );
};

export default Search;

