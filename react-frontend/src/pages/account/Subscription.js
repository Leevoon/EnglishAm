import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

export default function Subscription() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/account/subscription').then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  const plan = data && data.plan;
  return (
    <>
      <h1>Subscription</h1>
      {!plan ? (
        <div className="card">
          <p className="muted">You're on the free plan.</p>
          <p>Upgrade to unlock all premium tests, lessons, TOEFL/IELTS access, and downloadable books.</p>
          <Link to="/membership" className="btn">Upgrade to Premium</Link>
        </div>
      ) : (
        <div className="card">
          <h3>Current plan</h3>
          <p><span className={`badge ${plan.id === 1 ? 'free' : plan.id === 2 ? 'silver' : 'gold'}`}>Plan {plan.id}</span></p>
          <p className="muted">Price: ${Number(plan.price || 0).toFixed(2)}</p>
          <Link to="/membership" className="btn outline">Change plan</Link>
        </div>
      )}
    </>
  );
}
