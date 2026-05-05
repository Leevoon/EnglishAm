import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { NewsList, NewsDetail } from './pages/News';
import Gallery from './pages/Gallery';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Faq from './pages/Faq';
import Membership from './pages/Membership';
import StaticPage from './pages/StaticPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import TestList from './pages/tests/TestList';
import TestPlayer from './pages/tests/TestPlayer';

import { ToeflReadingList, ToeflReadingTest } from './pages/toefl/ToeflReading';
import { ToeflListeningList, ToeflListeningTest } from './pages/toefl/ToeflListening';
import { ToeflSpeaking, ToeflWriting, ToeflComplete } from './pages/toefl/ToeflPlaceholders';
import { IeltsList, IeltsReadingTest, IeltsComplete } from './pages/ielts/Ielts';

import Training from './pages/training/Training';

import AccountLayout from './pages/account/AccountLayout';
import Dashboard from './pages/account/Dashboard';
import Profile from './pages/account/Profile';
import Results from './pages/account/Results';
import Statistics from './pages/account/Statistics';
import Subscription from './pages/account/Subscription';
import ChangePassword from './pages/account/ChangePassword';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function PublicSite() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/static/:key" element={<StaticPage />} />
        <Route path="/cv-templates" element={<StaticPage />} />
        <Route path="/downloadable-books" element={<StaticPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/tests/:category" element={<TestList />} />
        <Route path="/test/:id" element={<TestPlayer />} />

        <Route path="/toefl/reading" element={<ToeflReadingList />} />
        <Route path="/toefl/reading/:id" element={<ToeflReadingTest />} />
        <Route path="/toefl/listening" element={<ToeflListeningList />} />
        <Route path="/toefl/listening/:id" element={<ToeflListeningTest />} />
        <Route path="/toefl/speaking" element={<ToeflSpeaking />} />
        <Route path="/toefl/writing" element={<ToeflWriting />} />
        <Route path="/toefl/writing/integrated" element={<ToeflWriting />} />
        <Route path="/toefl/writing/independent" element={<ToeflWriting />} />
        <Route path="/toefl/complete" element={<ToeflComplete />} />

        <Route path="/ielts/:track/reading" element={<IeltsList kind="reading" title="Reading" subtitle="Standard reading practice with full review." />} />
        <Route path="/ielts/:track/reading/:id" element={<IeltsReadingTest />} />
        <Route path="/ielts/:track/listening" element={<IeltsList kind="listening" title="Listening" subtitle="Listening practice with audio clips." />} />
        <Route path="/ielts/:track/speaking" element={<IeltsList kind="speaking" title="Speaking" subtitle="Speaking prompts for solo practice." />} />
        <Route path="/ielts/:track/writing" element={<IeltsList kind="writing" title="Writing" subtitle="Writing prompts for offline practice." />} />
        <Route path="/ielts/:track/complete" element={<IeltsComplete />} />

        <Route path="/training/:skill" element={<Training />} />

        <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="results" element={<Results />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<Spinner />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}
