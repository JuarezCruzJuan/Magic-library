# Magic Library Frontend - Despliegue

## Configuración para Despliegue en Vercel/Netlify

### Variables de Entorno
En tu plataforma de despliegue (Vercel/Netlify), configura la siguiente variable de entorno:

```
NODE_ENV=production
```

### URL de la API
La aplicación está configurada para conectarse automáticamente a:
- **Desarrollo**: `http://localhost:3001/api`
- **Producción**: `https://magic-library.onrender.com/api`

### Comandos de Build
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Despliegue Rápido

#### En Vercel:
1. Conecta tu repositorio de GitHub
2. Selecciona la carpeta `client` como directorio raíz
3. Vercel detectará automáticamente que es una app React
4. Configura `NODE_ENV=production` en las variables de entorno
5. Despliega

#### En Netlify:
1. Conecta tu repositorio de GitHub
2. Configura:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
3. Configura `NODE_ENV=production` en las variables de entorno
4. Despliega

### Estructura del Proyecto
```
client/
├── src/
│   ├── config/
│   │   └── api.js          # Configuración de URLs de API
│   ├── Components/
│   └── ...
├── public/
├── package.json
└── README-DEPLOY.md
```

### API Endpoints Disponibles
La API backend está desplegada en: `https://magic-library.onrender.com/api`

Endpoints principales:
- `/api/login` - Autenticación
- `/api/register` - Registro de usuarios
- `/api/books` - Gestión de libros
- `/api/users` - Gestión de usuarios
- `/api/create-payment-intent` - Pagos con Stripe