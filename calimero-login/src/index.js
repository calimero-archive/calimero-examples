import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import App from './App';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);