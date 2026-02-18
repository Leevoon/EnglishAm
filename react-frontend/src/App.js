import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NewsPage from './pages/NewsPage';
import GalleryPage from './pages/GalleryPage';
import LessonsPage from './pages/LessonsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AccountPage from './pages/AccountPage';

// Test Pages
import TestListPage from './pages/TestListPage';
import TestCategoryPage from './pages/TestCategoryPage';
import TestPage from './pages/TestPage';

// TOEFL Pages
import ToeflReading from './components/toefl/ToeflReading';
import ToeflListening from './components/toefl/ToeflListening';
import ToeflSpeaking from './components/toefl/ToeflSpeaking';
import ToeflWriting from './components/toefl/ToeflWriting';
import ToeflComplete from './components/toefl/ToeflComplete';

// IELTS Pages
import IeltsReading from './components/ielts/IeltsReading';
import IeltsListening from './components/ielts/IeltsListening';
import IeltsSpeaking from './components/ielts/IeltsSpeaking';
import IeltsWriting from './components/ielts/IeltsWriting';
import IeltsComplete from './components/ielts/IeltsComplete';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                {/* ========== PUBLIC PAGES ========== */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/lessons" element={<LessonsPage />} />

                {/* ========== AUTH PAGES ========== */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ========== ACCOUNT PAGES ========== */}
                <Route path="/account" element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } />
                <Route path="/account/profile" element={
                  <ProtectedRoute>
                    <AccountPage section="profile" />
                  </ProtectedRoute>
                } />
                <Route path="/account/results" element={
                  <ProtectedRoute>
                    <AccountPage section="results" />
                  </ProtectedRoute>
                } />
                <Route path="/account/statistics" element={
                  <ProtectedRoute>
                    <AccountPage section="statistics" />
                  </ProtectedRoute>
                } />
                <Route path="/account/subscription" element={
                  <ProtectedRoute>
                    <AccountPage section="subscription" />
                  </ProtectedRoute>
                } />
                <Route path="/account/change-password" element={
                  <ProtectedRoute>
                    <AccountPage section="change-password" />
                  </ProtectedRoute>
                } />

                {/* ========== TESTS ========== */}
                <Route path="/tests/:category" element={<TestListPage />} />
                <Route path="/tests/:categoryId/:testId" element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                } />

                {/* ========== TOEFL ========== */}
                <Route path="/toefl/reading" element={<ToeflReading />} />
                <Route path="/toefl/listening" element={<ToeflListening />} />
                <Route path="/toefl/speaking" element={<ToeflSpeaking />} />
                <Route path="/toefl/writing" element={<ToeflWriting />} />
                <Route path="/toefl/writing/integrated" element={<ToeflWriting />} />
                <Route path="/toefl/writing/independent" element={<ToeflWriting />} />
                <Route path="/toefl/complete" element={<ToeflComplete />} />

                {/* ========== IELTS GENERAL ========== */}
                <Route path="/ielts/general/reading" element={<IeltsReading />} />
                <Route path="/ielts/general/listening" element={<IeltsListening />} />
                <Route path="/ielts/general/speaking" element={<IeltsSpeaking />} />
                <Route path="/ielts/general/writing" element={<IeltsWriting />} />
                <Route path="/ielts/general/complete" element={<IeltsComplete />} />

                {/* ========== IELTS ACADEMIC ========== */}
                <Route path="/ielts/academic/reading" element={<IeltsReading />} />
                <Route path="/ielts/academic/listening" element={<IeltsListening />} />
                <Route path="/ielts/academic/speaking" element={<IeltsSpeaking />} />
                <Route path="/ielts/academic/writing" element={<IeltsWriting />} />
                <Route path="/ielts/academic/complete" element={<IeltsComplete />} />

                {/* ========== TRAINING ========== */}
                <Route path="/training/reading" element={<LessonsPage />} />
                <Route path="/training/listening" element={<LessonsPage />} />
                <Route path="/training/speaking" element={<LessonsPage />} />
                <Route path="/training/writing" element={<LessonsPage />} />

                {/* ========== ERROR PAGES ========== */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
