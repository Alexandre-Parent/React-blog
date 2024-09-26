import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Application from './application';


ReactDOM.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
  document.getElementById('root')
);


reportWebVitals();
