const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = require('./db.config');

async function setupCategories() {
    try {
        // Verificar si la tabla existe
        const [tables] = await pool.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'
        `, [process.env.DB_NAME || 'magiclibrary']);
        
        // Si la tabla no existe, crearla
        if (tables.length === 0) {
            console.log('Creando tabla categories...');
            await pool.query(`
                CREATE TABLE categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL
                )
            `);
            console.log('Tabla categories creada correctamente.');
        } else {
            console.log('La tabla categories ya existe.');
        }
        
        // Verificar si hay datos en la tabla
        const [existingCategories] = await pool.query('SELECT * FROM categories');
        
        if (existingCategories.length === 0) {
            console.log('Insertando categorías por defecto...');
            
            // Categorías por defecto
            const defaultCategories = [
                { nombre: 'Ciencia Ficción' },
                { nombre: 'Clásicos' },
                { nombre: 'Terror' },
                { nombre: 'Suspenso' },
                { nombre: 'Fantasía' }
            ];
            
            // Insertar categorías
            for (const category of defaultCategories) {
                await pool.query('INSERT INTO categories (nombre) VALUES (?)', [category.nombre]);
            }
            
            console.log('Categorías insertadas correctamente.');
        } else {
            console.log('Ya existen categorías en la tabla.');
        }
        
        // Mostrar las categorías actuales
        const [categories] = await pool.query('SELECT * FROM categories');
        console.log('Categorías disponibles:');
        console.table(categories);
        
    } catch (error) {
        console.error('Error al configurar las categorías:', error);
    } finally {
        // Cerrar la conexión
        pool.end();
    }
}

// Ejecutar la función
setupCategories();