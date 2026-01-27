import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.user_name) {
      return user.user_name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user.first_name) {
      return user.first_name;
    }
    return user.user_name || 'User';
  };

  const menuItems = [
    { label: 'Dashboard', path: '/account', icon: '📊' },
    { label: 'My Profile', path: '/account/profile', icon: '👤' },
    { label: 'My Results', path: '/account/results', icon: '📝' },
    { label: 'Statistics', path: '/account/statistics', icon: '📈' },
    { label: 'Subscription', path: '/account/subscription', icon: '💳' },
    { label: 'Change Password', path: '/account/change-password', icon: '🔒' }
  ];

  return (
    <div className={`user-menu ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button 
        className="user-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="user-avatar">
          {user.avatar ? (
            <img src={`/vendor/img/avatars/${user.avatar}`} alt={getDisplayName()} />
          ) : (
            <span className="avatar-initials">{getInitials()}</span>
          )}
        </div>
        <span className="user-name">{getDisplayName()}</span>
        <svg className="user-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="user-dropdown" role="menu">
        <div className="user-dropdown-header">
          <div className="user-avatar-lg">
            {user.avatar ? (
              <img src={`/vendor/img/avatars/${user.avatar}`} alt={getDisplayName()} />
            ) : (
              <span className="avatar-initials">{getInitials()}</span>
            )}
          </div>
          <div className="user-info">
            <div className="user-fullname">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user.user_name}
            </div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>

        <div className="user-dropdown-divider"></div>

        <ul className="user-dropdown-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                className="user-dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="user-dropdown-divider"></div>

        <button className="user-dropdown-logout" onClick={handleLogout}>
          <span className="item-icon">🚪</span>
          <span className="item-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
