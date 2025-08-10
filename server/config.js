const mysql = require("mysql2");

function DatabaseConnection() {
  const db = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: process.env.mysql_port,
  });

  // Establish the connection
  db.connect((err) => {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    console.log("Connected to the database.");
  });

  return db; // Return the connection
}

module.exports = DatabaseConnection;
