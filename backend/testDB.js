const db = require('./config/db');

async function testDB() {
    try {
        const connection = await db.getConnection();
        console.log('MySQL Connected Successfully');
        connection.release();
    } catch (error) {
        console.log('Database Connection Failed:', error);
    }
}

testDB();