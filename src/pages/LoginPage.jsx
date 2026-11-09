import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    document.title = 'Sign In — BloodConnect Blood Bank';
    const cleanup = initAnimations();
    return cleanup;
  }, []);

  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || '/donors';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBanner({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      const { error } = await login(formData.email.trim(), formData.password);
      if (error) {
        setBanner({ type: 'error', message: error.message || 'Failed to sign in. Please check your credentials.' });
        setIsSubmitting(false);
        return;
      }

      setBanner({ type: 'success', message: 'Signed in successfully. Redirecting…' });
      showToast('Welcome back to BloodConnect!');

      setTimeout(() => {
        const destination = location.state?.from?.pathname || '/donors';
        navigate(destination, { replace: true });
      }, 800);
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'An unexpected error occurred.' });
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast('Password reset link sent if the email exists.');
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        <section className="auth-page scene-parent">
          <div className="bg-scene" aria-hidden="true">
            <div className="bg-worldmap left"></div>
            <div className="bg-worldmap"></div>
            <div className="bg-cloud cloud-drift-a" style={{ top: '6%', left: '6%', width: '90px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>
            <div className="bg-cloud cloud-drift-b" style={{ top: '10%', right: '8%', width: '80px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>

            <div className="bg-hand" style={{ bottom: '-2%', left: '-3%', width: '300px' }}>
              <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 200 L0 140 C10 110 30 95 55 92 C50 76 62 60 82 60 C78 44 92 28 110 30 C128 22 148 36 144 56 C164 54 176 72 166 90 C186 98 190 124 172 140 C166 160 140 168 116 160 C92 172 44 176 0 168 Z"
                  fill="var(--skin-1)"
                />
                <rect x="10" y="152" width="36" height="10" rx="5" fill="#fff" transform="rotate(-20 10 152)" />
                <rect x="4" y="167" width="36" height="10" rx="5" fill="#fff" transform="rotate(-20 4 167)" />
                <g className="cradled" transform="translate(90,60)">
                  <path
                    d="M28 9 C10 -12 -16 4 -9 28 C-2 50 28 68 28 68 C28 68 58 50 65 28 C72 4 46 -12 28 9 Z"
                    fill="var(--red-600)"
                  />
                  <path d="M22 26 h12 v10 h10 v12 h-10 v10 h-12 v-10 h-10 v-12 h10 z" fill="#fff" />
                </g>
              </svg>
            </div>

            <div className="bg-bag" style={{ top: '6%', right: '4%', width: '110px' }}>
              <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 30 Q20 14 36 14 L64 14 Q80 14 80 30 L80 110 Q80 128 50 128 Q20 128 20 110 Z"
                  fill="#fff"
                  stroke="var(--red-600)"
                  strokeWidth="3"
                />
                <rect className="bag-liquid" x="26" y="55" width="48" height="66" rx="10" fill="var(--red-500)" />
                <rect x="30" y="40" width="40" height="34" rx="6" fill="#fff" stroke="var(--red-100)" strokeWidth="1.5" />
                <path d="M46 48 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 v-8 h8 z" fill="var(--red-600)" />
              </svg>
            </div>
            <svg className="bg-tube" style={{ top: '9%', right: '12%', width: '92px', height: '80px', opacity: 0.7 }} viewBox="0 0 140 120">
              <path className="tube-flow" d="M70 20 C40 -6 4 24 20 54 C34 80 60 82 70 100 C80 82 106 80 120 54 C136 24 100 -6 70 20 Z" />
            </svg>
            <span className="bg-note alt" style={{ top: '22%', right: '3%', '--rot': '4deg' }}>
              Be the reason<br />someone smiles
            </span>

            <div className="bg-wave">
              <svg viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradLogin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--wave-1)' }} />
                    <stop offset="55%" style={{ stopColor: 'var(--wave-2)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--wave-3)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C260,30 460,150 760,100 C1040,50 1260,160 1600,80 L1600,200 L0,200 Z"
                  fill="url(#waveGradLogin)"
                />
                <g fill="rgba(255,255,255,0.16)">
                  <ellipse className="bg-leaf" cx="70" cy="96" rx="10" ry="30" />
                  <ellipse className="bg-leaf" cx="92" cy="100" rx="8" ry="24" />
                  <ellipse className="bg-leaf" cx="1510" cy="88" rx="10" ry="30" />
                  <ellipse className="bg-leaf" cx="1488" cy="94" rx="8" ry="24" />
                </g>
              </svg>
              <span className="wave-caption"><span className="hr"></span>Donate Blood · Spread Hope · Save Lives</span>
            </div>
          </div>
          <div className="auth-grid">
            <div className="auth-side reveal">
              <h1>
                Every drop creates a <em style={{ fontStyle: 'normal', color: 'var(--red-600)' }}>brighter tomorrow.</em>
              </h1>
              <p className="lede">Your small act of kindness can give someone a second chance at life.</p>
              <div className="auth-benefits">
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  Donate blood
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  Spread hope
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  Save lives
                </div>
              </div>
            </div>

            <div className="auth-card reveal">
              <div className="card-icon pulse-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="card-head">
                <h2>Welcome back</h2>
                <p>Sign in to continue to BloodConnect.</p>
              </div>

              <form id="loginForm" noValidate onSubmit={handleSubmit}>
                {banner && (
                  <div className={`banner show ${banner.type}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {banner.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4m0 4h.01M10.3 3.86l-8.2 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-2.94l-8.2-14.2a2 2 0 0 0-3.4 0z"
                        />
                      )}
                    </svg>
                    <span>{banner.message}</span>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="loginEmail">
                    Email address <span className="req">*</span>
                  </label>
                  <div className={`input-shell ${errors.email ? 'invalid' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                    </svg>
                    <input
                      type="email"
                      id="loginEmail"
                      placeholder="jane@email.com"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                    />
                  </div>
                  <span className="error-text">{errors.email || ''}</span>
                </div>

                <div className="field">
                  <label htmlFor="loginPassword">
                    Password <span className="req">*</span>
                  </label>
                  <div className={`input-shell ${errors.password ? 'invalid' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="loginPassword"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, password: e.target.value }));
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.6 21.6 0 0 1-2.44 3.35M14.12 14.12a3 3 0 1 1-4.24-4.24"
                          />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <span className="error-text">{errors.password || ''}</span>
                </div>

                <div className="remember-row">
                  <label>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                    />{' '}
                    Remember me
                  </label>
                  <a href="#" onClick={handleForgotPassword}>
                    Forgot password?
                  </a>
                </div>

                <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                  Sign in
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <div className="divider-or">or</div>
              <p className="form-foot-note">
                Don't have an account? <Link to="/register">Sign up now</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer type="compact" />
    </>
  );
}
