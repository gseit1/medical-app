const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  timezone: '+00:00',
  typeCast: function (field, next) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING') {
      return field.string('utf8');
    }
    return next();
  }
});

// Execute SET NAMES utf8mb4 on each new connection
pool.on('connection', (connection) => {
  connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
  connection.query('SET CHARACTER SET utf8mb4');
  connection.query('SET character_set_connection=utf8mb4');
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = { pool, testConnection };
