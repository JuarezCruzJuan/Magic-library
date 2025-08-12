const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bestlibrary'
});

connection.query(
  'SELECT * FROM users WHERE email = ?',
  ['Vulkan@gmail.com'],
  (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
    } else {
      console.log('User query results:');
      console.log(JSON.stringify(results, null, 2));
    }
    connection.end();
  }
);