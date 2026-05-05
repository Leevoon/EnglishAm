const { Sequelize } = require('sequelize');
const config = require('./index');

let sequelize = null;

function getSequelize() {
  if (config.useMock) return null;
  if (sequelize) return sequelize;
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    dialectOptions: { charset: config.db.charset },
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: false, freezeTableName: true },
  });
  return sequelize;
}

async function testConnection() {
  if (config.useMock) {
    console.log('[db] mock mode — skipping DB connection');
    return true;
  }
  try {
    const s = getSequelize();
    await s.authenticate();
    console.log('[db] connection ok');
    return true;
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    return false;
  }
}

module.exports = { getSequelize, testConnection };
