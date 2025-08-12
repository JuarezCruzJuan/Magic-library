-- Agregar columnas para la activación de usuarios
ALTER TABLE users
ADD COLUMN activation_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN is_active BOOLEAN DEFAULT FALSE,
ADD COLUMN activation_expiry DATETIME DEFAULT NULL;