import React, { useState } from 'react'
import{BrowserRouter,Routes, Route, Navigate}from 'react-router-dom'
import Register from './pages/Register'
import Login from "./pages/Login"
import Home from "./pages/Home"
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  return (
    <BrowserRouter>
    <ToastContainer position='top-center' autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={userId ? <Home userId={userId} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login onLogin={setUserId} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
