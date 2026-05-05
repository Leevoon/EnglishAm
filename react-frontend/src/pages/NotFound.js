import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty">
        <h1>404 — page not found</h1>
        <p className="muted">That page doesn't exist (or moved).</p>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    </section>
  );
}
