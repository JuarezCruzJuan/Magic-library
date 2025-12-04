// Función para registrar el service worker
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.log('Error al registrar el ServiceWorker:', error);
        });
    });
  }
}

// Función para desregistrar el service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}