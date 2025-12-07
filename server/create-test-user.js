const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = require('./db.config');

async function createTestUser() {
    try {
        // Datos del usuario de prueba
        const email = 'Vulkan@gmail.com';
        const password = '1234';
        const nombre = 'Usuario de Prueba';
        const rol = 'admin';
        
        // Verificar si el usuario ya existe
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            console.log('El usuario ya existe. Actualizando contraseña...');
            
            // Actualizar la contraseña y activar la cuenta
            await pool.query(
                'UPDATE users SET password = ?, is_active = TRUE WHERE email = ?',
                [password, email]
            );
            
            console.log('Contraseña actualizada y cuenta activada correctamente.');
        } else {
            console.log('Creando nuevo usuario...');
            
            // Insertar nuevo usuario
            await pool.query(
                'INSERT INTO users (nombre, email, password, rol, is_active) VALUES (?, ?, ?, ?, TRUE)',
                [nombre, email, password, rol]
            );
            
            console.log('Usuario creado correctamente.');
        }
        
        console.log('Usuario de prueba listo para usar:');
        console.log('Email:', email);
        console.log('Contraseña:', password);
        console.log('Rol:', rol);
        
    } catch (error) {
        console.error('Error al crear el usuario de prueba:', error);
    } finally {
        // Cerrar la conexión
        pool.end();
    }
}

// Ejecutar la función
createTestUser();