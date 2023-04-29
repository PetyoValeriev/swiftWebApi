const mysql = require('mysql2/promise');

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Test the connection
pool
  .getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Error connecting to database:', err));

module.exports = { pool };
