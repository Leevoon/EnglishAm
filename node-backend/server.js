const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (audio, images, videos) from the legacy project vendor folder
app.use('/vendor', express.static(path.join(__dirname, '../../html/vendor')));

// Check if using mock data (set USE_MOCK=true in .env or environment)
const useMock = process.env.USE_MOCK === 'true';

if (useMock) {
  console.log('Using MOCK data (no database required)');
  const mockRoutes = require('./routes/mock');
  app.use('/api', mockRoutes);
} else {
  // Routes (database required)
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/tests', require('./routes/tests'));
  app.use('/api/toefl', require('./routes/toefl'));
  app.use('/api/ielts', require('./routes/ielts'));
  app.use('/api/content', require('./routes/content'));
  app.use('/api/ads', require('./routes/ads'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/home', require('./routes/home'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
