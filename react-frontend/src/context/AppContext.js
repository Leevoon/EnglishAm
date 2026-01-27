import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [testCategories, setTestCategories] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState({ 
    id: 1, 
    name: 'English', 
    code: 'en',
    flag: '🇬🇧'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAll(currentLanguage.id);
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
      
      try {
        const response = await categoriesAPI.getTestCategoriesForMenu(currentLanguage.id);
        setTestCategories(response.data || []);
      } catch (error) {
        console.error('Error loading test categories:', error);
        setTestCategories([]);
      }
    };
    
    fetchData();
  }, [currentLanguage.id]);

  const reloadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll(currentLanguage.id);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    // Optionally store in localStorage
    localStorage.setItem('language', JSON.stringify(language));
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      try {
        setCurrentLanguage(JSON.parse(savedLanguage));
      } catch (e) {
        // Invalid JSON, use default
      }
    }
  }, []);

  const value = {
    categories,
    testCategories,
    currentLanguage,
    setCurrentLanguage: changeLanguage,
    loading,
    reloadCategories
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
