const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Use the Supabase Connection String from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

/**
 * Migration Helper: Converts SQLite '?' syntax to PostgreSQL '$1, $2' syntax
 * This allows us to keep the rest of our code unchanged!
 */
function convertToPgSyntax(query) {
  let count = 0;
  return query.replace(/\?/g, () => {
    count++;
    return `$${count}`;
  });
}

const dbRun = async (query, params = []) => {
  const pgQuery = convertToPgSyntax(query);
  try {
    const res = await pool.query(pgQuery, params);
    return res;
  } catch (err) {
    console.error('Supabase Query Error:', err);
    throw err;
  }
};

const dbGet = async (query, params = []) => {
  const pgQuery = convertToPgSyntax(query);
  try {
    const res = await pool.query(pgQuery, params);
    return res.rows[0]; // Return the first row to match SQLite's db.get()
  } catch (err) {
    console.error('Supabase Query Error:', err);
    throw err;
  }
};

// Add dbAll to handle lists of results
const dbAll = async (query, params = []) => {
    const pgQuery = convertToPgSyntax(query);
    try {
      const res = await pool.query(pgQuery, params);
      return res.rows;
    } catch (err) {
      console.error('Supabase Query Error:', err);
      throw err;
    }
  };

module.exports = { pool, dbRun, dbGet, dbAll };
