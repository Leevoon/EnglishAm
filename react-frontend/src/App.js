import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// Main site layout wrapper
const MainLayout = ({ children }) => (
  <div className="App">
    <Header />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </div>
);

// Main site routes (non-admin)
const MainSiteRoutes = () => (
  <Routes>
    {/* ========== MAIN SITE ========== */}
    <Route path="/" element={<MainLayout><Home /></MainLayout>} />
    <Route path="/about" element={<MainLayout><About /></MainLayout>} />
    <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
    <Route path="/news" element={<MainLayout><NewsPage /></MainLayout>} />
    <Route path="/gallery" element={<MainLayout><GalleryPage /></MainLayout>} />
    <Route path="/lessons" element={<MainLayout><LessonsPage /></MainLayout>} />

    {/* ========== AUTH PAGES ========== */}
    <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
    <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

    {/* ========== ACCOUNT PAGES ========== */}
    <Route path="/account" element={
      <MainLayout>
        <ProtectedRoute><AccountPage /></ProtectedRoute>
      </MainLayout>
    } />
    <Route path="/account/profile" element={
      <MainLayout>
        <ProtectedRoute><AccountPage section="profile" /></ProtectedRoute>
      </MainLayout>
    } />
    <Route path="/account/results" element={
      <MainLayout>
        <ProtectedRoute><AccountPage section="results" /></ProtectedRoute>
      </MainLayout>
    } />
    <Route path="/account/statistics" element={
      <MainLayout>
        <ProtectedRoute><AccountPage section="statistics" /></ProtectedRoute>
      </MainLayout>
    } />
    <Route path="/account/subscription" element={
      <MainLayout>
        <ProtectedRoute><AccountPage section="subscription" /></ProtectedRoute>
      </MainLayout>
    } />
    <Route path="/account/change-password" element={
      <MainLayout>
        <ProtectedRoute><AccountPage section="change-password" /></ProtectedRoute>
      </MainLayout>
    } />

    {/* ========== TESTS ========== */}
    <Route path="/tests/:category" element={<MainLayout><TestListPage /></MainLayout>} />
    <Route path="/tests/:categoryId/:testId" element={
      <MainLayout>
        <ProtectedRoute><TestPage /></ProtectedRoute>
      </MainLayout>
    } />

    {/* ========== TOEFL ========== */}
    <Route path="/toefl/reading" element={<MainLayout><ToeflReading /></MainLayout>} />
    <Route path="/toefl/listening" element={<MainLayout><ToeflListening /></MainLayout>} />
    <Route path="/toefl/speaking" element={<MainLayout><ToeflSpeaking /></MainLayout>} />
    <Route path="/toefl/writing" element={<MainLayout><ToeflWriting /></MainLayout>} />
    <Route path="/toefl/writing/integrated" element={<MainLayout><ToeflWriting /></MainLayout>} />
    <Route path="/toefl/writing/independent" element={<MainLayout><ToeflWriting /></MainLayout>} />
    <Route path="/toefl/complete" element={<MainLayout><ToeflComplete /></MainLayout>} />

    {/* ========== IELTS GENERAL ========== */}
    <Route path="/ielts/general/reading" element={<MainLayout><IeltsReading /></MainLayout>} />
    <Route path="/ielts/general/listening" element={<MainLayout><IeltsListening /></MainLayout>} />
    <Route path="/ielts/general/speaking" element={<MainLayout><IeltsSpeaking /></MainLayout>} />
    <Route path="/ielts/general/writing" element={<MainLayout><IeltsWriting /></MainLayout>} />
    <Route path="/ielts/general/complete" element={<MainLayout><IeltsComplete /></MainLayout>} />

    {/* ========== IELTS ACADEMIC ========== */}
    <Route path="/ielts/academic/reading" element={<MainLayout><IeltsReading /></MainLayout>} />
    <Route path="/ielts/academic/listening" element={<MainLayout><IeltsListening /></MainLayout>} />
    <Route path="/ielts/academic/speaking" element={<MainLayout><IeltsSpeaking /></MainLayout>} />
    <Route path="/ielts/academic/writing" element={<MainLayout><IeltsWriting /></MainLayout>} />
    <Route path="/ielts/academic/complete" element={<MainLayout><IeltsComplete /></MainLayout>} />

    {/* ========== TRAINING ========== */}
    <Route path="/training/reading" element={<MainLayout><LessonsPage /></MainLayout>} />
    <Route path="/training/listening" element={<MainLayout><LessonsPage /></MainLayout>} />
    <Route path="/training/speaking" element={<MainLayout><LessonsPage /></MainLayout>} />
    <Route path="/training/writing" element={<MainLayout><LessonsPage /></MainLayout>} />

    {/* ========== ERROR PAGES ========== */}
    <Route path="/404" element={<MainLayout><NotFound /></MainLayout>} />
    <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
  </Routes>
);

// Error boundary for admin
class AdminErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Arial'}}>
          <h1>Admin Panel Error</h1>
          <p style={{color: 'red'}}>{this.state.error?.message || 'Something went wrong'}</p>
          <p>Please check the browser console for more details.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Check if we're on admin route - render admin separately (it has its own router)
  if (window.location.pathname.startsWith('/admin')) {
    // Lazy load admin to avoid router conflicts
    const AdminApp = React.lazy(() => import('./admin/AdminApp'));
    return (
      <AdminErrorBoundary>
        <React.Suspense fallback={<div style={{padding: '50px', textAlign: 'center'}}>Loading Admin...</div>}>
          <AdminApp />
        </React.Suspense>
      </AdminErrorBoundary>
    );
  }

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <MainSiteRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
