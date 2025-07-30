const mysql = require('mysql2');

// ✅ Create a connection pool (RECOMMENDED for production)
const db = mysql.createPool({
  //host: 'id-dci-web1632.main-hosting.eu',
  //user: 'u744752345_user',
  //password: 'KarthiAthi@123',
  //database: 'u744752345_uyirveli',
  host: 'localhost',
  user: 'karthi',
  password: 'password',
  database: 'uyirveli_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ This is enough — no need to call db.connect()
console.log('✅ MySQL connection pool initialized (Hostinger)');

module.exports = db;
