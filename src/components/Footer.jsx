import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer({ type = 'compact' }) {
  const currentYear = new Date().getFullYear();

  if (type === 'compact') {
    return (
      <footer className="site-footer">
        <div className="container">
          <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span>© <span data-year>{currentYear}</span> BloodConnect Blood Bank. Every drop counts.</span>
            <span>Made with ♥ for donors everywhere.</span>
          </div>
        </div>
      </footer>
    );
  }

  const isHome = type === 'home';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/#top" style={{ color: '#fff' }}>
              <span className="brand-mark">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.7 5c2 0 3.4 1 4.3 2.4C11 6 12.3 5 14.3 5c3.4 0 5.1 3.4 3.7 6.7C19.5 16.4 12 21 12 21z" />
                </svg>
              </span>
              <span className="brand-name">
                <span>BloodConnect</span>
                <span style={{ color: '#f2a5ae' }}>DONATE · SAVE LIFE</span>
              </span>
            </Link>
            <p>Connecting willing donors with the people and hospitals who need them most.</p>
            {isHome && (
              <div className="footer-socials" aria-hidden="true">
                <a href="#top" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
                <a href="#top" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#top" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              </div>
            )}
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/#top">Home</Link></li>
              <li><Link to="/#about">About</Link></li>
              <li><Link to="/camps">Donation camps</Link></li>
              <li><Link to="/donors">Find donors</Link></li>
              <li><Link to="/requests">Blood requests</Link></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><Link to="/register-donor">Register as donor</Link></li>
              <li><Link to="/request-blood">Request blood</Link></li>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/#contact">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href="tel:+919999999999">+91 99999 99999</a></li>
              <li><a href="mailto:hello@mybloodbank.com">hello@mybloodbank.com</a></li>
              {isHome && (
                <li><Link to="/#contact">221 Bhaktived Marg, Mumbai</Link></li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© <span data-year>{currentYear}</span> BloodConnect Blood Bank. Every drop counts.</span>
          <span>Made with ♥ for donors everywhere.</span>
        </div>
      </div>
    </footer>
  );
}
