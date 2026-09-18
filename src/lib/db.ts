import mysql from 'mysql2/promise';

// Tworzymy pulę połączeń z bazą danych MySQL z krótkim timeoutem, aby nie blokować renderowania stron
export const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 3000,
});
