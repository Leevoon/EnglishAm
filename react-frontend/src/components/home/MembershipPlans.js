import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './MembershipPlans.css';

const MembershipPlans = () => {
  const { currentLanguage } = useApp();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberships();
  }, [currentLanguage.id]);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getMemberships(currentLanguage.id);
      setMemberships(response.data || []);
    } catch (error) {
      console.error('Error loading memberships:', error);
      // Use fallback data
      setMemberships([
        {
          id: 1,
          price: 0,
          membershipLabels: [{ title: 'Free Access', value: null }],
          features: {
            audioTests: 'Limited',
            synonymTests: 'Limited',
            generalEnglishTests: 'Limited',
            professionalEnglishTests: 'Limited',
            photoTests: 'Limited',
            personalAccount: false,
            resultView: false,
            statistics: false,
            cvTemplates: false,
            downloadableBooks: false,
            lessons: false,
            toeflIelts: false,
            onlineSupport: false,
            privateTutoring: false,
            trainingEngine: false
          }
        },
        {
          id: 2,
          price: 29,
          membershipLabels: [{ title: 'Silver User', value: null }],
          features: {
            audioTests: 'Unlimited',
            synonymTests: 'Unlimited',
            generalEnglishTests: 'Unlimited',
            professionalEnglishTests: 'Unlimited',
            photoTests: 'Unlimited',
            personalAccount: true,
            resultView: true,
            statistics: true,
            cvTemplates: 'Limited',
            downloadableBooks: 'Limited',
            lessons: 'Limited',
            toeflIelts: 'Limited',
            onlineSupport: false,
            privateTutoring: false,
            trainingEngine: false
          }
        },
        {
          id: 3,
          price: 99,
          membershipLabels: [{ title: 'Golden User', value: null }],
          features: {
            audioTests: 'Unlimited',
            synonymTests: 'Unlimited',
            generalEnglishTests: 'Unlimited',
            professionalEnglishTests: 'Unlimited',
            photoTests: 'Unlimited',
            personalAccount: 'VIP',
            resultView: true,
            statistics: true,
            cvTemplates: 'Unlimited',
            downloadableBooks: 'Unlimited',
            lessons: 'Unlimited',
            toeflIelts: 'Unlimited',
            onlineSupport: 'VIP',
            privateTutoring: 'VIP',
            trainingEngine: 'VIP'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const featureLabels = [
    { key: 'audioTests', label: 'audio tests' },
    { key: 'synonymTests', label: 'synonym tests' },
    { key: 'generalEnglishTests', label: 'general english tests' },
    { key: 'professionalEnglishTests', label: 'professional english tests' },
    { key: 'photoTests', label: 'photo tests' },
    { key: 'personalAccount', label: 'personal account' },
    { key: 'resultView', label: 'result view' },
    { key: 'statistics', label: 'achievement-related statistics' },
    { key: 'cvTemplates', label: 'CV/Letter templates' },
    { key: 'downloadableBooks', label: 'downloadable books' },
    { key: 'lessons', label: 'lessons' },
    { key: 'toeflIelts', label: 'TOEFL iBT/IELTS tests' },
    { key: 'onlineSupport', label: 'online support' },
    { key: 'privateTutoring', label: 'private tutoring' },
    { key: 'trainingEngine', label: 'training engine' }
  ];

  const renderFeatureValue = (value) => {
    if (value === false || value === 'No') {
      return <span className="feature-no">No</span>;
    }
    if (value === true) {
      return <span className="feature-yes">✓</span>;
    }
    if (value === 'Limited') {
      return <span className="feature-limited"><strong>Limited</strong></span>;
    }
    if (value === 'Unlimited') {
      return <span className="feature-unlimited"><strong>Unlimited</strong></span>;
    }
    if (value === 'VIP') {
      return <span className="feature-vip"><strong>VIP</strong></span>;
    }
    return <span className="feature-text">{value}</span>;
  };

  const planStyles = [
    { className: 'plan-free', color: '#78909C' },
    { className: 'plan-silver', color: '#90A4AE' },
    { className: 'plan-gold', color: '#FFD700' }
  ];

  if (loading) {
    return (
      <section id="membership" className="membership-section">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading membership plans...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="membership" className="membership-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Choose The Membership</span>
          <h2 className="section-title">HONORARY MEMBERSHIP OPTIONS</h2>
        </div>

        <div className="membership-grid">
          {memberships.map((membership, index) => {
            const label = membership.membershipLabels?.[0];
            const style = planStyles[index] || planStyles[0];
            const isPopular = index === 2;

            return (
              <div 
                key={membership.id} 
                className={`membership-card ${style.className} ${isPopular ? 'featured' : ''}`}
              >
                {isPopular && <div className="popular-badge">POPULAR</div>}
                
                <div className="membership-price">
                  <span className="price-value">
                    {membership.price === 0 ? '0' : membership.price}
                  </span>
                </div>

                <h3 className="membership-title">
                  {label?.title || `Plan ${membership.id}`}
                </h3>

                <ul className="membership-features">
                  {featureLabels.map((feature) => (
                    <li key={feature.key}>
                      {renderFeatureValue(membership.features?.[feature.key])}
                      <span className="feature-label">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to={membership.price === 0 ? '/register' : '/membership'} 
                  className="btn btn-membership"
                >
                  choose plan
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;


