const { pool } = require('./services/db');

async function checkUsers() {
  try {
    const res = await pool.query(`SELECT * FROM users;`);
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
