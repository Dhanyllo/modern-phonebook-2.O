const mysql =require('mysql');

function DatabaseConnection() {
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mysql_password, // Ensure env variable is correctly set
    database: 'modern_phonebook',
  });

  // Establish the connection
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to the database.');
  });

  return db; // Return the connection
}

module.exports= DatabaseConnection;
