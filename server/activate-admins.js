const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

// Actualizar todos los usuarios con rol admin para activarlos
connection.query(
  'UPDATE users SET is_active = 1 WHERE rol = "admin"',
  (err, result) => {
    if (err) {
      console.error('Error activating admin users:', err);
    } else {
      console.log('Admin users activated successfully');
      console.log(`Rows affected: ${result.affectedRows}`);
      
      // Verificar los usuarios actualizados
      connection.query(
        'SELECT id, nombre, email, rol, is_active FROM users WHERE rol = "admin"',
        (err, results) => {
          if (err) {
            console.error('Error querying admin users:', err);
          } else {
            console.log('\nUpdated admin users:');
            results.forEach(user => {
              console.log(`\nUser ID: ${user.id}`);
              console.log(`- Name: ${user.nombre}`);
              console.log(`- Email: ${user.email}`);
              console.log(`- Is active: ${user.is_active ? 'Yes' : 'No'}`);
            });
          }
          connection.end();
        }
      );
    }
  }
);