import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

function InstallPrompt() {
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la app');
    }
    
    setDeferredPrompt(null);
    setInstallable(false);
    setShowPrompt(false);
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  if (!installable || !showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="close-button" onClick={handleClosePrompt}>×</button>
        <div className="install-icon">
          <i className="fas fa-mobile-alt"></i>
        </div>
        <h3>¡Instala Magic Library!</h3>
        <p>Accede rápidamente a tu librería digital desde tu pantalla de inicio</p>
        <div className="install-buttons">
          <button onClick={handleInstallClick} className="install-button">
            <i className="fas fa-download"></i>
            Instalar App
          </button>
          <button onClick={handleClosePrompt} className="later-button">
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;