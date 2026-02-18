import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import './Header.css';

const Header = () => {
  const { currentLanguage } = useApp();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="header-logo">
              <span className="logo-text">english</span>
              <span className="logo-dot">.</span>
              <span className="logo-domain">am</span>
            </Link>

            {/* Desktop Navigation */}
            <Navigation />

            {/* Right Side Actions */}
            <div className="header-actions">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Auth Section */}
              {isAuthenticated ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <div className="header-auth-buttons">
                  <Link to="/login" className="btn btn-outline btn-login">
                    login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-register">
                    register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
