import React, { useState, useEffect } from 'react';
import { faqAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './FaqPage.css';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const { currentLanguage } = useApp();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await faqAPI.getAll(currentLanguage.id);
        setFaqs(response.data || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [currentLanguage.id]);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="faq-page">
        <div className="container">
          <div className="faq-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about English.am</p>
        </div>

        <div className="faq-list">
          {faqs.length === 0 ? (
            <p className="faq-empty">No FAQs available at this time.</p>
          ) : (
            faqs.map(faq => {
              const label = faq.faqLabels && faq.faqLabels[0];
              if (!label || !label.question) return null;

              return (
                <div key={faq.id} className={`faq-item ${openId === faq.id ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                    <span>{label.question}</span>
                    <svg className="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {openId === faq.id ? (
                        <path d="M5 12h14" />
                      ) : (
                        <>
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </>
                      )}
                    </svg>
                  </button>
                  {openId === faq.id && label.answer && (
                    <div className="faq-answer" dangerouslySetInnerHTML={{ __html: label.answer }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
