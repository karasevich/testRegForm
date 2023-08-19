import React from 'react';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Profile from './Profile';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />}>
        <Route path='/profile/' element={<Dashboard />}></Route>
        <Route path='/profile/:id' element={<Profile />}></Route>
      </Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;