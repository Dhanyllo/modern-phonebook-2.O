const mysql = require("mysql2/promise");

function DatabaseConnection() {
  const pool = mysql.createPool({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: process.env.mysql_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Database pool created.");

  return pool;
}

module.exports = DatabaseConnection;
