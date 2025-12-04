const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'magiclibrary',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Attempting login for:', email);
        
        // Primero obtenemos el usuario por email
        const [rows] = await pool.query(
            'SELECT id, nombre, email, password, rol, is_active FROM users WHERE email = ?',
            [email]
        );
    
        console.log('User found:', rows.length > 0 ? 'Yes' : 'No');

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        const user = rows[0];
        
        // Verificar la contraseña (puede ser hasheada o texto plano)
        let passwordMatch = false;
        
        // Si la contraseña almacenada empieza con $2a$, $2b$, o $2y$, es un hash de bcrypt
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // Comparación directa para contraseñas en texto plano
            passwordMatch = password === user.password;
        }
        
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        // Remover la contraseña del objeto user antes de continuar
        delete user.password;
        
        // Verificar si la cuenta está activada
        if (!user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Cuenta no activada. Por favor, revisa tu correo electrónico para activar tu cuenta.' 
            });
        }
        
        // Si todo está correcto, devolvemos la información del usuario
        delete user.is_active; // No necesitamos enviar este campo al cliente
        res.json({ success: true, user });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error de base de datos',
            details: error.message 
        });
    }
});

// Ruta para solicitar recuperación de contraseña
router.post('/recover-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Verificar si el usuario existe
        const [users] = await pool.query('SELECT id, nombre FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            // Por seguridad, no revelamos si el email existe o no
            return res.json({ 
                success: true, 
                message: 'Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.' 
            });
        }
        
        const user = users[0];
        
        // Generar token único para recuperación (válido por 1 hora)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
        
        // Guardar token en la base de datos
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, user.id]
        );
        
        // En una implementación real, aquí enviarías un correo electrónico con el enlace
        // para restablecer la contraseña, que incluiría el token
        // Ejemplo: https://tudominio.com/reset-password?token=resetToken
        
        console.log(`Token de recuperación para ${email}: ${resetToken}`);
        
        res.json({ 
            success: true, 
            message: 'Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.' 
        });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar la solicitud',
            details: error.message 
        });
    }
});

// Ruta para restablecer la contraseña con el token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token y nueva contraseña son requeridos' 
            });
        }
        
        // Validar la nueva contraseña
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.message 
            });
        }
        
        // Buscar usuario con el token válido
        const [users] = await pool.query(
            'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
            [token, new Date()]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token inválido o expirado' 
            });
        }
        
        const userId = users[0].id;
        
        // Actualizar contraseña y limpiar token
        await pool.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [newPassword, userId]
        );
        
        res.json({ 
            success: true, 
            message: 'Contraseña actualizada correctamente' 
        });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar la solicitud',
            details: error.message 
        });
    }
});

// Ruta para activar la cuenta de usuario
router.get('/activate', async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token de activación requerido' 
            });
        }
        
        // Buscar usuario con el token de activación válido
        const [users] = await pool.query(
            'SELECT id FROM users WHERE activation_token = ? AND activation_expiry > ? AND is_active = false',
            [token, new Date()]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token de activación inválido o expirado' 
            });
        }
        
        const userId = users[0].id;
        
        // Activar la cuenta y limpiar token
        await pool.query(
            'UPDATE users SET is_active = true, activation_token = NULL, activation_expiry = NULL WHERE id = ?',
            [userId]
        );
        
        res.json({ 
            success: true, 
            message: 'Cuenta activada correctamente. Ahora puedes iniciar sesión.' 
        });
    } catch (error) {
        console.error('Error al activar cuenta:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar la solicitud',
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

        // Insert new admin with active status
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email, password, rol, is_active) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, password, rol, true]
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

        // Verificar si el email ya existe
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

        // Insertar nuevo usuario como activo, sin verificación por correo
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email, password, rol, is_active) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, password, rol || 'cliente', true]
        );

        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.',
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
        
        // Handle image conversion
        const booksWithImages = books.map(book => {
            if (book.imagen) {
                if (Buffer.isBuffer(book.imagen)) {
                    // Check if Buffer contains base64 string or binary data
                    const bufferString = book.imagen.toString('utf8');
                    if (bufferString.startsWith('data:image')) {
                        // Buffer contains complete data URL, use as is
                        book.imagen = bufferString;
                    } else if (bufferString.startsWith('/9j/') || bufferString.startsWith('iVBORw0KGgo')) {
                        // Buffer contains base64 string, add data URL prefix
                        book.imagen = `data:image/jpeg;base64,${bufferString}`;
                    } else {
                        // Buffer contains binary data, convert to base64
                        book.imagen = `data:image/jpeg;base64,${book.imagen.toString('base64')}`;
                    }
                } else if (typeof book.imagen === 'string') {
                    if (book.imagen.startsWith('data:image')) {
                        // Already has data URL prefix, leave as is
                        // Do nothing
                    } else {
                        // String without data URL prefix, add it
                        book.imagen = `data:image/jpeg;base64,${book.imagen}`;
                    }
                }
            }
            return book;
        });
        
        res.json(booksWithImages);
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

