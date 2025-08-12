const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

// Reemplaza esto con el email que estás usando para iniciar sesión en la aplicación
const emailToCheck = 'Vulkan@gmail.com';

connection.query(
  'SELECT id, nombre, email, password, rol, is_active FROM users WHERE email = ?',
  [emailToCheck],
  (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
    } else {
      console.log('User query results:');
      console.log(JSON.stringify(results, null, 2));
      
      if (results.length === 0) {
        console.log('No user found with this email');
      } else {
        const user = results[0];
        console.log('\nUser status:');
        console.log(`- Email: ${user.email}`);
        console.log(`- Password: ${user.password}`);
        console.log(`- Is active: ${user.is_active ? 'Yes' : 'No'}`);
      }
    }
    connection.end();
  }
);