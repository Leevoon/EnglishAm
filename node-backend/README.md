# Backend Setup and Running Instructions

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MySQL** database running with the `english_18_01_19` database

## Setup Steps

### 1. Install Dependencies

```bash
cd node-backend
npm install
```

### 2. Create Environment File

Create a `.env` file in the `node-backend` directory with the following content:

```env
# Enable mock data mode (set to false to use database)
USE_MOCK=true

# Database Configuration (only used when USE_MOCK=false)
DB_HOST=localhost
DB_NAME=english_18_01_19
DB_USER=root
DB_PASSWORD=pNhqa5__
DB_CHARSET=utf8

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-secret-key-change-this-in-production
```

**Note:** Adjust the database credentials if your MySQL setup is different.

## Mock Data Mode

The backend supports a mock data mode for development and testing without a database.

### Enabling Mock Mode

Set `USE_MOCK=true` in your `.env` file to use mock data instead of the database.

```env
USE_MOCK=true
```

### Mock Mode Features

- No MySQL database required
- Pre-populated test data for all endpoints
- Test login credentials: `test@example.com` / `password`
- Includes mock data for:
  - Categories and test categories
  - Tests with questions and answers
  - Slideshows, news, memberships
  - Testimonials, gallery
  - Static page content

### Switching to Database Mode

To use a real database, set `USE_MOCK=false` in your `.env` file and ensure your database is properly configured.

### 3. Run the Backend

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

### 4. Verify It's Running

Open your browser or use curl:
```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{"status":"ok","message":"API is running"}
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Make sure MySQL is running: `sudo systemctl status mysql`
2. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
3. Check your credentials in the `.env` file match your MySQL setup

### Port Already in Use

If port 3001 is already in use, change the `PORT` in your `.env` file.

### Missing Dependencies

If you see module not found errors, run:
```bash
npm install
```



