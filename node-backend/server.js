const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { testConnection } = require('./config/db');
const routes = require('./routes');
const { attachUser } = require('./middleware/auth');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(attachUser);

// Static uploads dir (created lazily)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    name: 'english.am API',
    mode: config.useMock ? 'mock' : 'database',
    docs: '/api/health',
  });
});

// Centralised error handler — keep response shape consistent for the FE.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error('[error]', err.message, err.stack && err.stack.split('\n').slice(0, 3).join(' | '));
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

(async () => {
  await testConnection();
  app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port}  mode=${config.useMock ? 'mock' : 'db'}`);
  });
})();
