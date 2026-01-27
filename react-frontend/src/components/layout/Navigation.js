import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Navigation menu structure matching english.am
  const menuItems = [
    {
      label: 'about us',
      path: '/about',
      type: 'link'
    },
    {
      label: 'TESTS',
      type: 'dropdown',
      children: [
        { label: 'AUDIO TESTS', path: '/tests/audio' },
        { label: 'SYNONYMS', path: '/tests/synonyms' },
        { label: 'ANTONYMS', path: '/tests/antonyms' },
        { label: 'GENERAL ENGLISH', path: '/tests/general-english' },
        { label: 'PROFESSIONAL ENGLISH', path: '/tests/professional-english' },
        { label: 'PHOTO TESTS', path: '/tests/photo' }
      ]
    },
    {
      label: 'TOEFL iBT',
      type: 'dropdown',
      children: [
        { label: 'READING', path: '/toefl/reading' },
        { label: 'LISTENING', path: '/toefl/listening' },
        { label: 'SPEAKING', path: '/toefl/speaking' },
        { 
          label: 'WRITING',
          type: 'submenu',
          children: [
            { label: 'integrated writing', path: '/toefl/writing/integrated' },
            { label: 'independent writing', path: '/toefl/writing/independent' }
          ]
        },
        { label: 'COMPLETE TEST', path: '/toefl/complete' }
      ]
    },
    {
      label: 'IELTS',
      type: 'dropdown',
      children: [
        {
          label: 'IELTS General Training Test',
          type: 'submenu',
          children: [
            { label: 'READING', path: '/ielts/general/reading' },
            { label: 'LISTENING', path: '/ielts/general/listening' },
            { label: 'SPEAKING', path: '/ielts/general/speaking' },
            { label: 'WRITING', path: '/ielts/general/writing' },
            { label: 'COMPLETE TEST', path: '/ielts/general/complete' }
          ]
        },
        {
          label: 'IELTS Academic Test',
          type: 'submenu',
          children: [
            { label: 'READING', path: '/ielts/academic/reading' },
            { label: 'LISTENING', path: '/ielts/academic/listening' },
            { label: 'SPEAKING', path: '/ielts/academic/speaking' },
            { label: 'WRITING', path: '/ielts/academic/writing' },
            { label: 'COMPLETE TEST', path: '/ielts/academic/complete' }
          ]
        }
      ]
    },
    {
      label: 'Training',
      type: 'dropdown',
      children: [
        { label: 'Reading Skills', path: '/training/reading' },
        { label: 'Listening Skills', path: '/training/listening' },
        { label: 'Speaking Skills', path: '/training/speaking' },
        { label: 'Writing Skills', path: '/training/writing' }
      ]
    },
    {
      label: 'lessons',
      path: '/lessons',
      type: 'link'
    },
    {
      label: 'contact us',
      path: '/contact',
      type: 'link'
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.type === 'link') {
      return (
        <li key={index} className="nav-item">
          <NavLink 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        </li>
      );
    }

    if (item.type === 'dropdown') {
      return (
        <li 
          key={index} 
          className={`nav-item has-dropdown ${activeDropdown === item.label ? 'open' : ''}`}
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          <span className="nav-link dropdown-toggle">
            {item.label}
            <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <ul className="dropdown-menu">
            {item.children.map((child, childIndex) => renderDropdownItem(child, childIndex))}
          </ul>
        </li>
      );
    }

    return null;
  };

  const renderDropdownItem = (item, index) => {
    if (item.type === 'submenu') {
      return (
        <li key={index} className="dropdown-item has-submenu">
          <span className="dropdown-link">
            {item.label}
            <svg className="submenu-arrow" width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <ul className="submenu">
            {item.children.map((subItem, subIndex) => (
              <li key={subIndex} className="submenu-item">
                <Link to={subItem.path} className="submenu-link">
                  {subItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={index} className="dropdown-item">
        <Link to={item.path} className="dropdown-link">
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <nav className="main-navigation" role="navigation" aria-label="Main navigation">
      <ul className="nav-menu">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </ul>
    </nav>
  );
};

export default Navigation;
