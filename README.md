# English.am - Modern Web Application

A modern English learning platform built with React and Node.js.

## Project Structure

```
english-am-new/
├── react-frontend/    # React.js frontend application
├── node-backend/      # Node.js/Express API server
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd english-am-new
   ```

2. **Set up the backend**
   ```bash
   cd node-backend
   npm install
   
   # Configure database connection in config/database.js
   npm start
   ```
   The API server will run on http://localhost:3001

3. **Set up the frontend**
   ```bash
   cd react-frontend
   npm install
   npm start
   ```
   The app will open at http://localhost:3000

## Features

### Frontend (React)
- Modern responsive design
- TOEFL & IELTS test preparation
- Interactive English tests (Audio, Synonyms, Antonyms, etc.)
- User authentication
- Membership plans
- Multi-language support

### Backend (Node.js)
- RESTful API
- User authentication with JWT
- Database integration with MySQL
- Test management endpoints
- Content management

## Tech Stack

- **Frontend**: React.js, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js, MySQL2, JWT
- **Database**: MySQL

## Available Routes

### Public Pages
- `/` - Home page
- `/about` - About us
- `/contact` - Contact page
- `/news` - News listing
- `/gallery` - Photo gallery
- `/lessons` - Lessons

### Tests
- `/tests/:category` - Test listings (audio, synonyms, antonyms, etc.)
- `/toefl/*` - TOEFL preparation
- `/ielts/*` - IELTS preparation
- `/training/*` - Training exercises

### Authentication
- `/login` - User login
- `/register` - User registration

## License

This project is proprietary software for English.am.
