const db = require('./db');

const initializeDatabase = async () => {
  await db.initialize();
};

module.exports = { initializeDatabase };
