import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import AdminDashboard from './Components/Admin/AdminDashboard';
import UserDashboard from './Components/User/UserDashboard';
import RegisterAdmin from './Components/Admin/RegisterAdmin';
import GestionBooks from './Components/Admin/GestionBooks';
import About from './Components/User/About';
import Help from './Components/User/Help';
import Profile from './Components/User/Profile';
import ShoppingCart from './Components/User/ShoppingCart';
import UserManagement from './Components/Admin/UserManagement';
import EditUser from './Components/Admin/EditUser';
import Clasicos from './Components/User/Clasicos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />
        <Route path="/admin/books" element={<GestionBooks />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help/>} />
        <Route path="/clasicos" element={<Clasicos/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<ShoppingCart />} /> 
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/edit/:id" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;