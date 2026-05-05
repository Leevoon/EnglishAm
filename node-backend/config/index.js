require('dotenv').config();

const useMock = String(process.env.USE_MOCK || 'false').toLowerCase() === 'true';

module.exports = {
  useMock,
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  jwtExpiresInSec: 7 * 24 * 60 * 60,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'english_18_01_19',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: process.env.DB_CHARSET || 'utf8',
  },
  defaultLanguageId: 1,
};
