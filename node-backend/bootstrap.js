// Startup-time schema bootstrapping for tables that can be safely auto-created
// in production when the ops team can't (or hasn't) run the migration SQL by
// hand. Each step must be idempotent — it runs on every backend start.

const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

async function ensureHomePageCategoriesTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS home_page_categories (
      id            INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      source_type   ENUM('category','lessons_filter') NOT NULL,
      source_id     INT(11) UNSIGNED NOT NULL,
      icon          VARCHAR(32)  DEFAULT NULL,
      color         VARCHAR(16)  DEFAULT NULL,
      description   VARCHAR(500) DEFAULT NULL,
      sort_order    INT(11)      NOT NULL DEFAULT 0,
      status        TINYINT(1)   NOT NULL DEFAULT 1,
      created_date  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY source_lookup (source_type, source_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `);

  const [{ n }] = await sequelize.query(
    'SELECT COUNT(*) AS n FROM home_page_categories',
    { type: QueryTypes.SELECT }
  );

  // Only seed on first creation — later edits via the admin UI must survive restarts.
  if (Number(n) === 0) {
    await sequelize.query(`
      INSERT INTO home_page_categories
        (source_type, source_id, icon, color, description, sort_order, status)
      VALUES
        ('lessons_filter', 5, '📚', '#4CAF50', 'Expand your vocabulary with our comprehensive word lists', 1, 1),
        ('lessons_filter', 8, '💬', '#2196F3', 'Practice real-life conversations and improve speaking',   2, 1),
        ('lessons_filter', 7, '🖼️', '#FF9800', 'Learn words through visual associations',                 3, 1)
    `);
  }
}

async function runBootstrap() {
  try {
    await ensureHomePageCategoriesTable();
    console.log('[bootstrap] schema checks passed');
  } catch (err) {
    // Don't crash the server — log and continue so other endpoints keep working.
    console.error('[bootstrap] schema check failed:', err.message);
  }
}

module.exports = { runBootstrap };
