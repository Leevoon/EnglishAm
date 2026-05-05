import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TITLES = {
  reading: 'Reading Skills',
  listening: 'Listening Skills',
  speaking: 'Speaking Skills',
  writing: 'Writing Skills',
};

export default function Training() {
  const { skill } = useParams();
  const title = TITLES[skill] || 'Training';
  return (
    <section className="section">
      <div className="container">
        <h1>{title}</h1>
        <p className="subtitle">Bite-sized practice modules — currently surfaced through Lessons.</p>
        <Link to="/lessons" className="btn">Open lessons</Link>
      </div>
    </section>
  );
}
