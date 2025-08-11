import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2>Mi Perfil</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h4>Información Personal</h4>
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;