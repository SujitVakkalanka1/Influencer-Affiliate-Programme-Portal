require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function createAdmin() {
    const name = process.env.ADMIN_NAME || 'Admin User';
    const email = (process.env.ADMIN_EMAIL || 'admin@portal.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

    if (existing.length > 0) {
        await db.query('UPDATE users SET name = ?, password = ?, role = ? WHERE email = ?', [name, hashedPassword, 'admin', email]);
        console.log(`Admin updated: ${email}`);
    } else {
        await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'admin']);
        console.log(`Admin created: ${email}`);
    }

    await db.end();
}

createAdmin().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
