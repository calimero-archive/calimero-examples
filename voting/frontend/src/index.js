import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';

import Dashboard from './components/Dashboard/Dashboard';
window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);