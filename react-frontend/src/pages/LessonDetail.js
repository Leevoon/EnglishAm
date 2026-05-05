import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get(`/lessons/${id}`).then((r) => setLesson(r.data)).catch(() => setLesson(null)).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <Spinner />;
  if (!lesson) return <div className="empty">Lesson not found.</div>;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link to="/lessons" className="muted">← All lessons</Link>
        <h1>{lesson.name}</h1>
        <p className="muted">{lesson.description}</p>
        <article dangerouslySetInnerHTML={{ __html: lesson.lesson || '<p>This lesson has no content yet.</p>' }} />
      </div>
    </section>
  );
}
