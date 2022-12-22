import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Prevent from firefox-safari pop-ups
window.addEventListener('beforeunload', function (event) {
  event.stopImmediatePropagation();
});

ReactDOM.render(<App />, document.getElementById('root'));
