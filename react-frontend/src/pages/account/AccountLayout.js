import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountLayout() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const initial = (user.first_name || user.user_name || '?')[0].toUpperCase();
  return (
    <section className="container account-shell">
      <aside className="account-side">
        <div className="who">
          <div className="avatar">{initial}</div>
          <strong>{user.first_name || user.user_name}</strong>
          <span className="muted" style={{ fontSize: 12 }}>{user.email}</span>
        </div>
        <NavLink to="/account" end>📊 Dashboard</NavLink>
        <NavLink to="/account/profile">👤 My Profile</NavLink>
        <NavLink to="/account/results">📝 My Results</NavLink>
        <NavLink to="/account/statistics">📈 Statistics</NavLink>
        <NavLink to="/account/subscription">💳 Subscription</NavLink>
        <NavLink to="/account/change-password">🔒 Change Password</NavLink>
        <button className="btn ghost" onClick={logout} style={{ width: '100%', textAlign: 'left' }}>🚪 Logout</button>
      </aside>
      <div className="account-main">
        <Outlet />
      </div>
    </section>
  );
}
