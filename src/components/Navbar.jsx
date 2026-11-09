import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinksRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const pathname = location.pathname;
  const isHome = pathname === '/' || pathname === '/index.html';
  const isCamps = pathname === '/camps' || pathname === '/camps.html' || pathname === '/camp-details' || pathname === '/camp-details.html';
  const isDonors = pathname === '/donors';
  const isRequests = pathname === '/requests';
  const isAdmin = pathname === '/admin';
  const isLogin = pathname === '/login' || pathname === '/login.html';
  const isRegister = pathname === '/register' || pathname === '/register.html';
  const isAuth = isLogin || isRegister;

  // Close mobile nav on route change or outside click
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        isOpen &&
        navLinksRef.current &&
        !navLinksRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const handleLinkClick = (e, targetHash) => {
    setIsOpen(false);
    if (isHome && targetHash) {
      const el = document.querySelector(targetHash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', targetHash);
      }
    }
  };

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/#top" onClick={(e) => handleLinkClick(e, '#top')}>
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.7 5c2 0 3.4 1 4.3 2.4C11 6 12.3 5 14.3 5c3.4 0 5.1 3.4 3.7 6.7C19.5 16.4 12 21 12 21z" />
            </svg>
          </span>
          <span className="brand-name">
            <span>BloodConnect</span>
            <span>DONATE · SAVE LIFE</span>
          </span>
        </Link>

        <button
          ref={toggleBtnRef}
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav ref={navLinksRef} className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link
            to="/#top"
            className={isHome ? 'active' : ''}
            onClick={(e) => handleLinkClick(e, '#top')}
          >
            Home
          </Link>
          {!isAuth && (
            <Link
              to="/#about"
              onClick={(e) => handleLinkClick(e, '#about')}
            >
              About
            </Link>
          )}
          <Link
            to="/camps"
            className={isCamps ? 'active' : ''}
          >
            Donation Camps
          </Link>
          <Link
            to="/donors"
            className={isDonors ? 'active' : ''}
          >
            Find Donors
          </Link>
          <Link
            to="/requests"
            className={isRequests ? 'active' : ''}
          >
            Blood Requests
          </Link>
          {role === 'admin' && (
            <Link
              to="/admin"
              className={isAdmin ? 'active' : ''}
              style={{ color: 'var(--red-600)', fontWeight: 700 }}
            >
              Admin
            </Link>
          )}
          {!isAuth && !user && (
            <Link
              to="/#gallery"
              onClick={(e) => handleLinkClick(e, '#gallery')}
            >
              Gallery
            </Link>
          )}
          <Link
            to="/#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
          >
            Contact
          </Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="btn btn-outline btn-sm" to="/register-donor" title="Manage Donor Profile">
                Donor Profile
              </Link>
              <Link className="btn btn-primary btn-sm" to="/request-blood" title="Post a Blood Request">
                + Request
              </Link>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => logout()}
                title={`Signed in as ${user.email}`}
              >
                Logout
              </button>
            </>
          ) : isHome ? (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">
                <span className="long">Sign&nbsp;Up</span>
                <span aria-hidden="true" className="short" style={{ display: 'none' }}>Join</span>
              </Link>
            </>
          ) : isCamps ? (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Sign Up</Link>
            </>
          ) : isLogin ? (
            <Link className="btn btn-primary btn-sm" to="/register">Sign Up</Link>
          ) : (
            <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
