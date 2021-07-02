import React, { useState, useEffect, useContext } from 'react';
import QAwidget from './QA/QAwidget.jsx';
import SectionTracker from './Tracker/SectionTracker.jsx';

export const ThemeContext = React.createContext();

const App = () => {
  const [productId, setProductId] = useState(13023);
  const [darkTheme, setDarkTheme] = useState(false);
  const themeStyles = {
    backgroundColor: darkTheme ? '#222' : '#fff',
    color: darkTheme ? '#fff' : '#333',
    borderColor: darkTheme ? '#fff' : '#222'
  };

  return (
    <ThemeContext.Provider value={darkTheme}>
      <div id="darkTheme" style={themeStyles}>
        <div id="padding">
          <section id='questions-and-answers-section'>
            <SectionTracker sectionName={'questions-and-answers-section'} render={(handleTracking) => (
              <QAwidget
                productId={productId}
                setProductId={setProductId}
                handleTracking={handleTracking} />
            )}>
            </SectionTracker>
          </section>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;