const { pool } = require('./services/db');

async function migrateSchema() {
  try {
    // We add the columns. IF NOT EXISTS is not standard for ADD COLUMN in older postgres, 
    // but we can try or just catch the error if they exist.
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS video_credits INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS image_credits INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS enhancement_credits INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS restoration_credits INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS bg_removal_credits INTEGER DEFAULT 0;
    `);

    // Migrate existing credits to video_credits
    await pool.query(`
      UPDATE users SET video_credits = credits WHERE video_credits = 0 AND credits > 0;
    `);
    
    console.log("Migration successful");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateSchema();
