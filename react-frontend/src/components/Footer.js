import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Footer() {
  const [info, setInfo] = useState({});
  const [socials, setSocials] = useState([]);
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    api.get('/contact-info').then((r) => setInfo(r.data || {})).catch(() => {});
    api.get('/socials').then((r) => setSocials(r.data || [])).catch(() => {});
  }, []);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSignedUp(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>english.am</h4>
            <p className="muted">A multilingual English-learning platform run by an NGO. Tests, lessons, and full TOEFL & IELTS practice.</p>
            <div className="social">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.favicon || 'social'}>
                  <span className={s.favicon || 'fab fa-link'}></span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link><br />
            <Link to="/about">About Us</Link><br />
            <Link to="/news">News</Link><br />
            <Link to="/contact">Contact Us</Link><br />
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/cv-templates">CV / Letter Templates</Link><br />
            <Link to="/downloadable-books">Downloadable Books</Link><br />
            <Link to="/lessons">Lessons</Link><br />
            <Link to="/gallery">Gallery</Link>
          </div>
          <div>
            <h4>Stay in touch</h4>
            <p className="muted">{info.email}<br />{info.phone}<br />{info.address}</p>
            <form className="form" onSubmit={onSubscribe} style={{ marginTop: 12 }}>
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="btn" type="submit">Subscribe</button>
              {signedUp && <div className="alert success">Thanks — you're on the list.</div>}
            </form>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} english.am — all rights reserved</span>
          <span><Link to="/static/privacy">Privacy</Link> · <Link to="/static/terms">Terms</Link></span>
        </div>
      </div>
    </footer>
  );
}
