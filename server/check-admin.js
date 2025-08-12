const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

// Consulta para buscar usuarios con rol de administrador
connection.query(
  'SELECT id, nombre, email, password, rol, is_active FROM users WHERE rol = "admin"',
  (err, results) => {
    if (err) {
      console.error('Error querying admin users:', err);
    } else {
      console.log('Admin users found:', results.length);
      console.log(JSON.stringify(results, null, 2));
      
      if (results.length === 0) {
        console.log('No admin users found in the database');
      } else {
        console.log('\nAdmin users status:');
        results.forEach(user => {
          console.log(`\nUser ID: ${user.id}`);
          console.log(`- Name: ${user.nombre}`);
          console.log(`- Email: ${user.email}`);
          console.log(`- Password: ${user.password}`);
          console.log(`- Is active: ${user.is_active ? 'Yes' : 'No'}`);
        });
      }
    }
    connection.end();
  }
);