const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

connection.query(
  'UPDATE users SET is_active = ? WHERE email = ?',
  [1, 'Vulkan@gmail.com'],
  (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
    } else {
      console.log('User updated successfully');
      console.log(`Rows affected: ${result.affectedRows}`);
    }
    connection.end();
  }
);