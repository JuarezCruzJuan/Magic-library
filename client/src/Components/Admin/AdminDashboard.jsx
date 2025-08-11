import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Assents/css/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
      
      <div className="dashboard-content">
        <div className="admin-cards">
          <div className="admin-card" onClick={() => navigate('/admin/register')}>
            <h3>Register Admin</h3>
            <p>Add new administrators to the system</p>
          </div>
          
          <div className="admin-card" onClick={() => navigate('/admin/books')}>
            <h3>Book Management</h3>
            <p>Add, edit, delete and view books</p>
          </div>
          
          <div className="admin-card" onClick={() => navigate('/admin/users')}>
            <h3>User Management</h3>
            <p>View, edit and delete users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;