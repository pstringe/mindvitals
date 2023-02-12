import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Assessment } from './features/assessment/assessment-component';
import { Completed } from './features/completed/completed-component';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}> 
          <Route path=":batch" element={<Assessment review={false}/>}/>
        </Route>
        <Route path='/results' element={<App />}> 
          <Route path=":batch" element={<Assessment review={true}/>}/>
        </Route>
        <Route path='/completed' element={<Completed />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
