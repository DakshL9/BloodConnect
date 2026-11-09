import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    bloodGroup: '',
    city: '',
    location: '',
    lastDonation: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+]?[0-9\s-]{7,15}$/;

  useEffect(() => {
    document.title = 'Register as Donor — BloodConnect Blood Bank';
    const cleanup = initAnimations();
    return cleanup;
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const keyMap = {
      regName: 'fullName',
      regDob: 'dob',
      regEmail: 'email',
      regPhone: 'phone',
      regPassword: 'password',
      regBloodGroup: 'bloodGroup',
      regCity: 'city',
      regLocation: 'location',
      regLastDonation: 'lastDonation',
      regTerms: 'terms',
    };
    const key = keyMap[id] || id;
    setFormData((prev) => ({ ...prev, [key]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required.';
    } else if (!PHONE_RE.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.terms) newErrors.terms = 'Accepting the terms is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBanner({ type: 'error', message: 'Please fix the highlighted fields before continuing.' });
      return;
    }

    try {
      const donors = JSON.parse(localStorage.getItem('bloodconnect_donors') || '[]');
      donors.push({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('bloodconnect_donors', JSON.stringify(donors));
    } catch (err) {
      // Ignore localStorage in private mode
    }

    setBanner({ type: 'success', message: "You're registered! Redirecting you to sign in…" });
    showToast('Thanks for registering as a donor!');
    setIsSubmitting(true);

    setTimeout(() => {
      navigate('/login');
    }, 1300);
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
            <div className="bg-cloud cloud-drift-a" style={{ top: '6%', left: '4%', width: '90px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>
            <div className="bg-cloud cloud-drift-b" style={{ top: '8%', right: '6%', width: '90px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>

            <div className="bg-bag" style={{ top: '6%', left: '4%', width: '110px' }}>
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
            <svg className="bg-tube" style={{ top: '9%', left: '12%', width: '92px', height: '80px', opacity: 0.7 }} viewBox="0 0 140 120">
              <path className="tube-flow" d="M70 20 C40 -6 4 24 20 54 C34 80 60 82 70 100 C80 82 106 80 120 54 C136 24 100 -6 70 20 Z" />
            </svg>
            <span className="bg-note" style={{ top: '22%', left: '3%', '--rot': '-4deg' }}>
              A little kindness<br />saves lives <span className="heart-mark">♥</span>
            </span>

            <div className="bg-hand" style={{ bottom: '-2%', right: '-3%', width: '300px', transform: 'scaleX(-1)' }}>
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
            <span className="bg-note alt" style={{ top: '8%', right: '10%', '--rot': '5deg' }}>
              Be the reason<br />someone smiles
            </span>

            <div className="bg-wave">
              <svg viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradReg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--wave-1)' }} />
                    <stop offset="55%" style={{ stopColor: 'var(--wave-2)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--wave-3)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C260,30 460,150 760,100 C1040,50 1260,160 1600,80 L1600,200 L0,200 Z"
                  fill="url(#waveGradReg)"
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
                Be someone's <em style={{ fontStyle: 'normal', color: 'var(--red-600)' }}>second chance.</em>
              </h1>
              <p className="lede">Your small act of kindness can give someone a second chance at life.</p>
              <div className="auth-benefits">
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  Join a life-saving community
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </span>
                  Safe & secure — your data stays protected
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  Make an impact in your area
                </div>
              </div>
            </div>

            <div className="auth-card reveal" style={{ maxWidth: '640px' }}>
              <div className="card-icon pulse-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="card-head">
                <h2>Register as donor</h2>
                <p>Join our community and help save lives.</p>
              </div>

              <form id="registerForm" noValidate onSubmit={handleSubmit}>
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

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="regName">
                      Full name <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.fullName ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        id="regName"
                        placeholder="John Doe"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.fullName || ''}</span>
                  </div>

                  <div className="field">
                    <label htmlFor="regDob">
                      Date of birth <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.dob ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <input
                        type="date"
                        id="regDob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.dob || ''}</span>
                  </div>

                  <div className="field">
                    <label htmlFor="regEmail">
                      Email address <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.email ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                      </svg>
                      <input
                        type="email"
                        id="regEmail"
                        placeholder="johndoe123@email.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.email || ''}</span>
                  </div>

                  <div className="field">
                    <label htmlFor="regPhone">
                      Contact number <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.phone ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2z"
                        />
                      </svg>
                      <input
                        type="tel"
                        id="regPhone"
                        placeholder="+91 12345 67891"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.phone || ''}</span>
                  </div>

                  <div className="field full">
                    <label htmlFor="regPassword">
                      Password <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.password ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="regPassword"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
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

                  <div className="field">
                    <label htmlFor="regBloodGroup">
                      Blood group <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.bloodGroup ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                      </svg>
                      <select
                        id="regBloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">Select blood group</option>
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                        <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                      </select>
                    </div>
                    <span className="error-text">{errors.bloodGroup || ''}</span>
                  </div>

                  <div className="field">
                    <label htmlFor="regCity">
                      City <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.city ? 'invalid' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <select
                        id="regCity"
                        value={formData.city}
                        onChange={handleChange}
                      >
                        <option value="">Select city</option>
                        <option>Mumbai</option><option>Pune</option><option>Thane</option>
                        <option>Navi Mumbai</option><option>Nashik</option>
                      </select>
                    </div>
                    <span className="error-text">{errors.city || ''}</span>
                  </div>

                  <div className="field full">
                    <label htmlFor="regLocation">Location / area</label>
                    <div className="input-shell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <input
                        type="text"
                        id="regLocation"
                        placeholder="Andheri, Borivali, etc."
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="field full">
                    <label htmlFor="regLastDonation">Last donation date (optional)</label>
                    <div className="input-shell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <input
                        type="date"
                        id="regLastDonation"
                        value={formData.lastDonation}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="helper-text">This helps us determine your eligibility for donation.</p>
                  </div>
                </div>

                <div className="check-row">
                  <input
                    type="checkbox"
                    id="regTerms"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                  <label htmlFor="regTerms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I understand my information will be shared with blood banks for donation purposes.
                  </label>
                </div>

                <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                  Register as donor
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <p className="form-foot-note">
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer type="compact" />
    </>
  );
}
