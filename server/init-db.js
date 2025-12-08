const mysql = require('mysql2');
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db.config');

async function initDB() {
    try {
        console.log('Iniciando configuración de la base de datos...');

        // 1. Crear tabla users
        console.log('Verificando tabla users...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                rol VARCHAR(50) DEFAULT 'cliente',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla users verificada/creada.');

        // 2. Crear tabla categories
        console.log('Verificando tabla categories...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        console.log('Tabla categories verificada/creada.');

        // 3. Crear tabla books
        console.log('Verificando tabla books...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                autor VARCHAR(255) NOT NULL,
                descripcion TEXT,
                precio DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                imagen LONGTEXT,
                categoria_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (categoria_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);
        console.log('Tabla books verificada/creada.');

        // 4. Poblar categorías
        const defaultCategories = [
            'Ciencia Ficción', 'Clásicos', 'Terror', 'Suspenso', 'Fantasía', 
            'Novela Histórica', 'Romance', 'Desarrollo Personal'
        ];
        
        for (const cat of defaultCategories) {
            await pool.query(
                'INSERT IGNORE INTO categories (nombre) VALUES (?)', 
                [cat]
            );
        }
        console.log('Categorías insertadas (si no existían).');

        // 5. Crear usuario admin de prueba
        const email = 'Vulkan@gmail.com'; // Email del admin
        const password = '1234';
        const nombre = 'Admin Vulkan';
        
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length === 0) {
            // No hasheamos la contraseña aquí porque el código original parece guardar texto plano o el login maneja comparación directa 
            // (Voy a revisar auth.js para ver si usa bcrypt, pero create-test-user.js original usaba texto plano '1234' en el insert aunque importaba bcrypt)
            // Revisión rápida: create-test-user.js importaba bcrypt pero NO lo usaba en el INSERT. 
            // Auth.js usa: const validPassword = await bcrypt.compare(password, user.password); OJO
            // Si auth.js usa bcrypt, entonces DEBO hashear la contraseña.
            
            // Voy a asumir que debo hashear si auth.js usa bcrypt.
            // Reviso auth.js de nuevo...
            
            /* 
            En auth.js:
            const validPassword = await bcrypt.compare(password, rows[0].password);
            */
           
            // Entonces SI debo hashear. create-test-user.js original estaba MAL si insertaba texto plano.
            // Espera, create-test-user.js original:
            // const password = '1234';
            // INSERT ... VALUES (..., password, ...) -> insertaba '1234'.
            // Si auth.js espera hash, el login fallaría.
            
            // Voy a hashear la contraseña para hacerlo bien.
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await pool.query(
                'INSERT INTO users (nombre, email, password, rol, is_active) VALUES (?, ?, ?, ?, TRUE)',
                [nombre, email, hashedPassword, 'admin']
            );
            console.log(`Usuario admin creado: ${email} / ${password}`);
        } else {
             // Si existe, actualizamos password a hash para asegurar acceso
             const hashedPassword = await bcrypt.hash(password, 10);
             await pool.query(
                'UPDATE users SET password = ?, rol = ?, is_active = TRUE WHERE email = ?',
                [hashedPassword, 'admin', email]
            );
            console.log(`Usuario admin actualizado: ${email} / ${password}`);
        }

        console.log('Inicialización de base de datos completada exitosamente.');

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
    // No cerramos el pool aquí porque se usa en el servidor
}

module.exports = { initDB };
