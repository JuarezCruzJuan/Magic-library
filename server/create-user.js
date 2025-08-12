const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

connection.query(
  'INSERT INTO users (nombre, email, password, rol, is_active) VALUES (?, ?, ?, ?, ?)',
  ['Test User', 'test@example.com', 'password123', 'cliente', 1],
  (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
    } else {
      console.log('User created successfully');
    }
    connection.end();
  }
);