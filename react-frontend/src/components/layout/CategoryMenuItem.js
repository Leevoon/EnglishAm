import React from 'react';
import { Link } from 'react-router-dom';

const CategoryMenuItem = ({ category }) => {
  const hasChildren = category.children && category.children.length > 0;

  if (!hasChildren) {
    return (
      <li className="nav-item">
        <Link to={`/categories/${category.id}`} className="nav-link">
          {category.label || `Category ${category.id}`}
        </Link>
      </li>
    );
  }

  return (
    <li className="nav-item dropdown">
      <Link to={`/categories/${category.id}`} className="nav-link dropdown-toggle">
        {category.label || `Category ${category.id}`}
      </Link>
      {hasChildren && (
        <ul className="dropdown-menu">
          {category.children.map((child) => (
            <CategoryMenuItem key={child.id} category={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CategoryMenuItem;

