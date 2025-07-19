import React from 'react';
import './styles/App.css';
import Dashboard from './pages/Dashboard.jsx';
import PickMyStocks from './pages/PickMyStocks.jsx';
import StocksOfInterest from './pages/StocksOfInterest.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pick-my-stocks" element={<PickMyStocks />} />
        <Route path="/stocks-of-interest" element={<StocksOfInterest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
