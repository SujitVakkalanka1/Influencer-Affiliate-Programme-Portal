require('dotenv').config();
const db = require('./config/db');

(async () => {
  await db.initialize();
  await db.query('SELECT 1');
  console.log('MongoDB connected successfully');
})();
