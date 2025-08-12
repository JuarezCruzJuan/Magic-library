-- Script para actualizar la estructura de la tabla users
-- Agregar columnas para el token de recuperación de contraseña

ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;