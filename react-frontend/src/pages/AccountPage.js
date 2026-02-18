import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, testsAPI } from '../services/api';
import './AccountPage.css';

const AccountPage = ({ section = 'dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user?.id && (section === 'dashboard' || section === 'results' || section === 'statistics')) {
      loadUserData();
    }
  }, [user?.id, section]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setHistoryLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        testsAPI.getHistory(user.id),
        testsAPI.getStatistics(user.id)
      ]);
      setTestHistory(historyRes.data || []);
      setStatistics(statsRes.data || null);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/account', icon: '📊' },
    { key: 'profile', label: 'My Profile', path: '/account/profile', icon: '👤' },
    { key: 'results', label: 'My Results', path: '/account/results', icon: '📝' },
    { key: 'statistics', label: 'Statistics', path: '/account/statistics', icon: '📈' },
    { key: 'subscription', label: 'Subscription', path: '/account/subscription', icon: '💳' },
    { key: 'change-password', label: 'Change Password', path: '/account/change-password', icon: '🔒' }
  ];

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword);
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getLevel = (avgScore) => {
    if (avgScore >= 90) return 'Advanced';
    if (avgScore >= 70) return 'Intermediate';
    if (avgScore >= 50) return 'Elementary';
    return 'Beginner';
  };

  const renderDashboard = () => (
    <div className="account-dashboard">
      <h2>Welcome back, {user?.first_name || user?.user_name}!</h2>
      <p className="dashboard-subtitle">Manage your account and track your learning progress</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{statistics?.total_tests || 0}</span>
            <span className="stat-label">Tests Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{statistics?.average_score || 0}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{statistics?.total_correct || 0}/{statistics?.total_questions || 0}</span>
            <span className="stat-label">Correct Answers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <span className="stat-value">{getLevel(statistics?.average_score || 0)}</span>
            <span className="stat-label">Current Level</span>
          </div>
        </div>
      </div>

      {testHistory.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {testHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-info">
                  <span className="activity-name">{item.test_name || 'Test'}</span>
                  <span className="activity-category">{item.category_name || ''}</span>
                </div>
                <div className="activity-score">
                  <span className={`score ${item.score / item.score_from >= 0.7 ? 'good' : item.score / item.score_from >= 0.5 ? 'ok' : 'low'}`}>
                    {item.score}/{item.score_from}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/account/results" className="view-all-link">View all results →</Link>
        </div>
      )}

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/tests/general-english" className="action-btn">
            <span className="action-icon">📝</span>
            <span>Take a Test</span>
          </Link>
          <Link to="/toefl/reading" className="action-btn">
            <span className="action-icon">📖</span>
            <span>TOEFL Practice</span>
          </Link>
          <Link to="/ielts/general/reading" className="action-btn">
            <span className="action-icon">🎓</span>
            <span>IELTS Practice</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="account-profile">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.avatar ? (
            <img src={`/vendor/img/avatars/${user.avatar}`} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {(user?.first_name?.[0] || user?.user_name?.[0] || 'U').toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <div className="info-row">
            <label>Username</label>
            <span>{user?.user_name || '-'}</span>
          </div>
          <div className="info-row">
            <label>Email</label>
            <span>{user?.email || '-'}</span>
          </div>
          <div className="info-row">
            <label>First Name</label>
            <span>{user?.first_name || '-'}</span>
          </div>
          <div className="info-row">
            <label>Last Name</label>
            <span>{user?.last_name || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderResults = () => (
    <div className="account-results">
      <h2>My Results</h2>
      {historyLoading ? (
        <div className="loading-state">Loading results...</div>
      ) : testHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No test results yet</p>
          <p className="empty-hint">Complete some tests to see your results here</p>
          <Link to="/tests/general-english" className="btn btn-primary">
            Take Your First Test
          </Link>
        </div>
      ) : (
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Category</th>
                <th>Score</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map((item) => {
                const percentage = Math.round((item.score / item.score_from) * 100);
                return (
                  <tr key={item.id}>
                    <td className="test-name">{item.test_name || `Test #${item.test_id}`}</td>
                    <td className="category-name">{item.category_name || '-'}</td>
                    <td>
                      <span className={`score-badge ${percentage >= 70 ? 'good' : percentage >= 50 ? 'ok' : 'low'}`}>
                        {item.score}/{item.score_from} ({percentage}%)
                      </span>
                    </td>
                    <td>{item.duration || '-'}</td>
                    <td className="date">{formatDate(item.created_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderStatistics = () => (
    <div className="account-statistics">
      <h2>Statistics</h2>
      {historyLoading ? (
        <div className="loading-state">Loading statistics...</div>
      ) : !statistics || statistics.total_tests === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No statistics available yet</p>
          <p className="empty-hint">Start learning to track your progress</p>
          <Link to="/tests/general-english" className="btn btn-primary">
            Start Learning
          </Link>
        </div>
      ) : (
        <div className="statistics-content">
          <div className="stats-overview">
            <div className="stat-box">
              <span className="stat-number">{statistics.total_tests}</span>
              <span className="stat-text">Tests Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{statistics.total_correct}</span>
              <span className="stat-text">Correct Answers</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{statistics.total_questions}</span>
              <span className="stat-text">Total Questions</span>
            </div>
            <div className="stat-box highlight">
              <span className="stat-number">{statistics.average_score}%</span>
              <span className="stat-text">Average Score</span>
            </div>
          </div>
          
          <div className="level-progress">
            <h3>Your Level: {getLevel(statistics.average_score)}</h3>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${statistics.average_score}%` }}
              ></div>
            </div>
            <div className="level-markers">
              <span>Beginner</span>
              <span>Elementary</span>
              <span>Intermediate</span>
              <span>Advanced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubscription = () => (
    <div className="account-subscription">
      <h2>Subscription</h2>
      <div className="subscription-card">
        <div className="subscription-status">
          <span className="status-badge free">Free Plan</span>
        </div>
        <p>You are currently on the free plan with limited access.</p>
        <div className="subscription-features">
          <h4>Upgrade to Premium for:</h4>
          <ul>
            <li>Unlimited tests access</li>
            <li>Detailed answer explanations</li>
            <li>Progress tracking</li>
            <li>Certificate generation</li>
          </ul>
        </div>
        <button className="btn btn-primary btn-lg">Upgrade to Premium</button>
      </div>
    </div>
  );

  const renderChangePassword = () => (
    <div className="account-password">
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange} className="password-form">
        {passwordError && <div className="alert alert-danger">{passwordError}</div>}
        {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
        
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'profile':
        return renderProfile();
      case 'results':
        return renderResults();
      case 'statistics':
        return renderStatistics();
      case 'subscription':
        return renderSubscription();
      case 'change-password':
        return renderChangePassword();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="page account-page">
      <div className="container">
        <div className="account-layout">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="sidebar-user">
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={`/vendor/img/avatars/${user.avatar}`} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {(user?.first_name?.[0] || user?.user_name?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.first_name || user?.user_name}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            </div>
            
            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`nav-item ${section === item.key || (section === 'dashboard' && item.key === 'dashboard') ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
              <button onClick={handleLogout} className="nav-item logout-btn">
                <span className="nav-icon">🚪</span>
                <span className="nav-label">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="account-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

