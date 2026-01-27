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
# Database Configuration
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



