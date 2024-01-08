require('dotenv').config()
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const getConnection = async () => {
    const connection = await pool.getConnection();
    console.log('Database connected');
    return connection;
}
  
  module.exports = getConnection;