import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const { currentLanguage } = useApp();
  const [category, setCategory] = useState(null);
  const [testCategories, setTestCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [id, currentLanguage.id]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const [categoryResponse, testCategoriesResponse, subcategoriesResponse] = await Promise.all([
        categoriesAPI.getById(id, currentLanguage.id),
        categoriesAPI.getTestCategories(id, currentLanguage.id).catch(() => ({ data: [] })),
        categoriesAPI.getSubcategories(id, currentLanguage.id).catch(() => ({ data: [] }))
      ]);
      
      setCategory(categoryResponse.data);
      setTestCategories(testCategoriesResponse.data || []);
      setSubcategories(subcategoriesResponse.data || []);
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="loading">Loading category...</div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error">Category not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <h1>{category.label || `Category ${category.id}`}</h1>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="subcategories-section">
            <h2>Subcategories</h2>
            <div className="subcategories-grid">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  to={`/categories/${subcat.id}`}
                  className="subcategory-card"
                >
                  <h3>{subcat.label || `Category ${subcat.id}`}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Test Categories */}
        {testCategories.length > 0 && (
          <section className="test-categories-section">
            <h2>Test Categories</h2>
            <div className="test-categories-grid">
              {testCategories.map((testCat) => (
                <Link
                  key={testCat.id}
                  to={`/tests/${id}/${testCat.id}`}
                  className="test-category-card"
                >
                  <h3>{testCat.name}</h3>
                  {testCat.description && (
                    <p>{testCat.description.substring(0, 150)}...</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {subcategories.length === 0 && testCategories.length === 0 && (
          <div className="no-content">
            <p>No subcategories or test categories found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;



