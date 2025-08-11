const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bestlibrary',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Attempting login for:', email);
        
        const [rows] = await pool.query(
            'SELECT id, nombre, email, rol FROM users WHERE email = ? AND password = ?',
            [email, password]
        );
    
        console.log('Query results:', rows);

        if (rows.length > 0) {
            const user = rows[0];
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error',
            details: error.message 
        });
    }
});

// Función para validar contraseña
const validatePassword = (password) => {
 
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' }
  }
  
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula' }
  }
  
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra minúscula' }
  }
  
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un carácter especial' }
  }
  

  for (let i = 0; i < password.length - 1; i++) {
    if (
      !isNaN(parseInt(password[i])) && 
      !isNaN(parseInt(password[i+1])) && 
      parseInt(password[i]) + 1 === parseInt(password[i+1])
    ) {
      return { valid: false, message: 'La contraseña no debe contener números consecutivos' }
    }
  }
  

  const lowerPassword = password.toLowerCase()
  for (let i = 0; i < lowerPassword.length - 1; i++) {
    if (
      lowerPassword[i] >= 'a' && lowerPassword[i] <= 'z' &&
      lowerPassword[i+1] >= 'a' && lowerPassword[i+1] <= 'z' &&
      lowerPassword[i].charCodeAt(0) + 1 === lowerPassword[i+1].charCodeAt(0)
    ) {
      return { valid: false, message: 'La contraseña no debe contener letras consecutivas del abecedario' }
    }
  }
  
  return { valid: true }
}

router.post('/admin/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        console.log('Attempting to register admin:', email);

        // Validar contraseña
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.message 
            });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Insert new admin
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, password, rol]
        );

        res.json({ 
            success: true, 
            message: 'Admin registered successfully',
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering admin',
            details: error.message 
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        console.log('Attempting to register client:', email);

        // Validar contraseña
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.message 
            });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El email ya está registrado' 
            });
        }

        // Insert new client
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, password, rol]
        );

        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Client registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el registro',
            details: error.message 
        });
    }
});

// Categories routes
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las categorías',
            details: error.message 
        });
    }
});

// Books routes
router.get('/books', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener los libros',
            details: error.message 
        });
    }
});

router.post('/books', async (req, res) => {
    try {
        const { titulo, autor, descripcion, precio, stock, imagen, categoria_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO books (titulo, autor, descripcion, precio, stock, imagen, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [titulo, autor, descripcion, precio, stock, imagen, categoria_id]
        );
        res.json({ 
            success: true, 
            message: 'Libro agregado exitosamente',
            bookId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al agregar el libro',
            details: error.message 
        });
    }
});

router.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor, descripcion, precio, stock, imagen, categoria_id } = req.body;
        await pool.query(
            'UPDATE books SET titulo = ?, autor = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, categoria_id = ? WHERE id = ?',
            [titulo, autor, descripcion, precio, stock, imagen, categoria_id, id]
        );
        res.json({ 
            success: true, 
            message: 'Libro actualizado exitosamente' 
        });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar el libro',
            details: error.message 
        });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ 
            success: true, 
            message: 'Libro eliminado exitosamente' 
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el libro',
            details: error.message 
        });
    }
});

// Users routes
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, nombre, email, rol FROM users');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener los usuarios',
            details: error.message 
        });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await pool.query(
            'SELECT id, nombre, email, rol FROM users WHERE id = ?',
            [id]
        );
        
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el usuario',
            details: error.message 
        });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;
        
        // Verificar si el usuario existe
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );
        
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Verificar si el email ya está en uso por otro usuario
        if (email) {
            const [emailCheck] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, id]
            );
            
            if (emailCheck.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso por otro usuario'
                });
            }
        }
        
        // Actualizar usuario
        await pool.query(
            'UPDATE users SET nombre = ?, email = ?, rol = ? WHERE id = ?',
            [nombre, email, rol, id]
        );
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar el usuario',
            details: error.message 
        });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el usuario existe
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );
        
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Eliminar usuario
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el usuario',
            details: error.message 
        });
    }
});

module.exports = router;

