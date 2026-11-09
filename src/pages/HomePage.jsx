import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookModal from '../components/BookModal';
import { initAnimations } from '../utils/animations';
import { showToast } from '../utils/toast';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactBanner, setContactBanner] = useState(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    document.title = 'BloodConnect Blood Bank — Donate Blood, Spread Hope';
    const cleanup = initAnimations();
    return cleanup;
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!contactForm.name.trim()) newErrors.name = 'Name is required.';
    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(contactForm.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!contactForm.message.trim()) newErrors.message = 'Message is required.';

    if (Object.keys(newErrors).length > 0) {
      setContactErrors(newErrors);
      setContactBanner({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setContactBanner({ type: 'success', message: 'Message sent — our team will reply within one business day.' });
    showToast('Your message has been sent!');
    setContactForm({ name: '', email: '', message: '' });
    setContactErrors({});
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        {/* ===================== HERO ===================== */}
        <section className="hero scene-parent">
          <div className="bg-scene" aria-hidden="true">
            <div className="bg-worldmap"></div>
            <div className="bg-cloud cloud-drift-a" style={{ top: '9%', left: '5%', width: '110px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
                <ellipse cx="95" cy="40" rx="20" ry="14" fill="#fff" />
              </svg>
            </div>
            <div className="bg-cloud cloud-drift-b" style={{ top: '15%', left: '36%', width: '76px', opacity: 0.65 }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>
            <svg className="bg-tube" style={{ top: '4%', right: '5%', width: '130px', height: '112px', opacity: 0.45 }} viewBox="0 0 140 120">
              <path
                className="tube-flow"
                d="M70 20 C40 -6 4 24 20 54 C34 80 60 82 70 100 C80 82 106 80 120 54 C136 24 100 -6 70 20 Z"
              />
            </svg>
            <div className="bg-hand" style={{ bottom: '-3%', left: '-3%', width: '270px' }}>
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
            <span className="bg-note" style={{ bottom: '24%', left: '2%', '--rot': '-4deg' }}>
              A little kindness<br />saves lives <span className="heart-mark">♥</span>
            </span>
            <div className="bg-wave">
              <svg viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--wave-1)' }} />
                    <stop offset="55%" style={{ stopColor: 'var(--wave-2)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--wave-3)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 C220,20 420,140 700,90 C980,40 1220,150 1600,70 L1600,200 L0,200 Z"
                  fill="url(#waveGradHero)"
                />
                <g fill="rgba(255,255,255,0.16)">
                  <ellipse className="bg-leaf" cx="90" cy="96" rx="10" ry="34" />
                  <ellipse className="bg-leaf" cx="112" cy="100" rx="8" ry="26" />
                  <ellipse className="bg-leaf" cx="1490" cy="86" rx="10" ry="34" />
                  <ellipse className="bg-leaf" cx="1468" cy="92" rx="8" ry="26" />
                  <ellipse className="bg-leaf" cx="1512" cy="94" rx="7" ry="22" />
                </g>
              </svg>
              <span className="wave-caption"><span className="hr"></span>Donate today, for a brighter tomorrow</span>
            </div>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">A SAFER TOMORROW IS IN YOUR HANDS</p>
              <h1>Donate blood,<br /><em>spread hope.</em></h1>
              <p className="lede">
                Your small act of kindness can give someone a second chance at life. Join thousands of donors
                making a difference across the city, one drop at a time.
              </p>

              <div className="hero-meta">
                <div className="meta-chip">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </span>
                  Next drive: August 30<sup>th</sup>
                </div>
                <div className="meta-chip">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                    </svg>
                  </span>
                  Starts 10:00 AM
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  data-open-modal="bookModal"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  Book now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
                <Link className="btn btn-outline" to="/camps">Find a camp near you</Link>
              </div>

              <div className="hero-facts">
                <div className="fact">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  Help save lives
                </div>
                <div className="fact">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                    </svg>
                  </span>
                  Support your community
                </div>
                <div className="fact">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </span>
                  A healthier tomorrow
                </div>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="blob"></div>
              <span className="drip-note n1 float-accent">Be the reason<br />someone smiles</span>
              <div className="drip-card">
                <div className="drip-icon pulse-accent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                  </svg>
                </div>
                <h3>Good people give life</h3>
                <p>One donation can save up to three lives. Yours could be next.</p>
                <svg
                  className="heartbeat-line"
                  viewBox="0 0 220 40"
                  style={{ width: '100%', height: '32px', marginTop: '14px', color: 'var(--red-500)' }}
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,20 40,20 52,6 64,34 76,20 90,20 100,12 110,28 120,20 220,20"
                  />
                </svg>
              </div>
              <span className="drip-note n2 float-accent delay">Every drop counts ♥</span>
            </div>
          </div>
        </section>

        {/* ===================== STATS ===================== */}
        <section className="stats-strip">
          <div className="stats-grid reveal-group">
            <div className="stat reveal-child"><b data-count="12400" data-suffix="+">0</b><span>Units donated</span></div>
            <div className="stat reveal-child"><b data-count="6800" data-suffix="+">0</b><span>Registered donors</span></div>
            <div className="stat reveal-child"><b data-count="340" data-suffix="+">0</b><span>Camps organised</span></div>
            <div className="stat reveal-child"><b data-count="18" data-suffix="">0</b><span>Partner hospitals</span></div>
          </div>
        </section>

        {/* ===================== ABOUT / HOW IT WORKS ===================== */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Make a difference</span>
              <h2>How it works</h2>
              <p>Three simple steps stand between you and someone's second chance at life.</p>
            </div>

            <div className="steps reveal-group">
              <div className="step reveal-child">
                <div className="step-index">01</div>
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path strokeLinecap="round" d="M19 8v6M22 11h-6" />
                  </svg>
                </div>
                <h3>Register</h3>
                <p>Create your donor account, fill in your details, and get verified in minutes.</p>
              </div>
              <div className="step reveal-child">
                <div className="step-index">02</div>
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>
                <h3>Find a camp</h3>
                <p>Browse nearby donation camps and pick whichever date and location suit you.</p>
              </div>
              <div className="step reveal-child">
                <div className="step-index">03</div>
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                  </svg>
                </div>
                <h3>Donate</h3>
                <p>Visit the camp and donate blood. Your contribution helps save lives nearby.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== UPCOMING CAMPS PREVIEW ===================== */}
        <section className="section section-alt" id="upcoming">
          <div className="container">
            <div className="section-head reveal" style={{ marginBottom: '34px' }}>
              <span className="eyebrow">Be a hero</span>
              <h2>Upcoming donation camps</h2>
              <p>Find and register for blood donation camps near you.</p>
            </div>

            <div className="camp-grid reveal-group">
              <article className="camp-card reveal-child">
                <div className="camp-card-top">
                  <div className="date-badge"><span className="d">28</span><span className="m">Feb</span></div>
                  <span className="status-pill">Upcoming</span>
                </div>
                <div>
                  <h3>Community Blood Drive</h3>
                  <p className="org">City Blood Bank</p>
                </div>
                <div className="camp-detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span>221 Bhaktived Marg, Andheri, Mumbai</span>
                </div>
                <div className="camp-card-actions">
                  <Link className="btn btn-outline btn-sm" to="/camp-details?id=community-andheri">Details</Link>
                  <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
                </div>
              </article>
              <article className="camp-card reveal-child">
                <div className="camp-card-top">
                  <div className="date-badge"><span className="d">28</span><span className="m">Mar</span></div>
                  <span className="status-pill">Upcoming</span>
                </div>
                <div>
                  <h3>University Blood Drive</h3>
                  <p className="org">City Blood Bank</p>
                </div>
                <div className="camp-detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span>321 University Road, Borivali, Mumbai</span>
                </div>
                <div className="camp-card-actions">
                  <Link className="btn btn-outline btn-sm" to="/camp-details?id=university-borivali">Details</Link>
                  <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
                </div>
              </article>
              <article className="camp-card reveal-child">
                <div className="camp-card-top">
                  <div className="date-badge"><span className="d">26</span><span className="m">Feb</span></div>
                  <span className="status-pill">Upcoming</span>
                </div>
                <div>
                  <h3>Community Blood Drive</h3>
                  <p className="org">City Blood Bank</p>
                </div>
                <div className="camp-detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span>University Campus, DJSCE College, Mumbai</span>
                </div>
                <div className="camp-card-actions">
                  <Link className="btn btn-outline btn-sm" to="/camp-details?id=college-campus">Details</Link>
                  <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
                </div>
              </article>
            </div>

            <div className="text-center" style={{ marginTop: '36px' }}>
              <Link className="btn btn-outline" to="/camps">
                View all camps
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== WHY DONATE / VALUE PROPS ===================== */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Join our community</span>
              <h2>Why donors choose BloodConnect</h2>
              <p>Everything you need to make giving blood simple, safe, and rewarding.</p>
            </div>
            <div className="value-grid reveal-group">
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div>
                  <h4>Find nearby camps</h4>
                  <p>Discover donation drives happening close to you, sorted by city and blood group.</p>
                </div>
              </div>
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                </span>
                <div>
                  <h4>Urgent request alerts</h4>
                  <p>Get notified the moment someone nearby needs your blood type.</p>
                </div>
              </div>
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                  </svg>
                </span>
                <div>
                  <h4>Track your history</h4>
                  <p>Keep a record of every donation and know exactly when you're eligible again.</p>
                </div>
              </div>
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <div>
                  <h4>Direct blood-bank ties</h4>
                  <p>Stay connected with verified blood banks and hospitals across the city.</p>
                </div>
              </div>
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </span>
                <div>
                  <h4>Safe & secure</h4>
                  <p>Your personal data is encrypted and only ever shared with verified blood banks.</p>
                </div>
              </div>
              <div className="value-card reveal-child">
                <span className="icn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                  </svg>
                </span>
                <div>
                  <h4>Real impact</h4>
                  <p>See exactly how many lives your donations have helped save over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== GALLERY ===================== */}
        <section className="section section-alt" id="gallery">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Moments that matter</span>
              <h2>Gallery</h2>
              <p>Glimpses from recent donation camps and community drives.</p>
            </div>
            <div className="gallery-grid reveal-group">
              <div className="gallery-tile reveal-child">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                </svg>
                <span>Donation drive · Andheri</span>
              </div>
              <div className="gallery-tile reveal-child">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Volunteer team</span>
              </div>
              <div className="gallery-tile reveal-child">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>University Blood Drive</span>
              </div>
              <div className="gallery-tile reveal-child">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
                  />
                </svg>
                <span>First-time donors</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CONTACT ===================== */}
        <section className="section" id="contact">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">We'd love to hear from you</span>
              <h2>Get in touch</h2>
              <p>Questions about donating, hosting a camp, or partnering with us? Send a message.</p>
            </div>

            <div className="contact-wrap">
              <div className="contact-info reveal">
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <div>
                    <h4>Visit us</h4>
                    <p>221 Bhaktived Marg, Andheri, Mumbai 400058</p>
                  </div>
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <h4>Call us</h4>
                    <p>+91 99999 99999</p>
                  </div>
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <div>
                    <h4>Email us</h4>
                    <p>hello@mybloodbank.com</p>
                  </div>
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                    </svg>
                  </span>
                  <div>
                    <h4>Hours</h4>
                    <p>Mon – Sat, 9:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              <form className="contact-form reveal" id="contactForm" noValidate onSubmit={handleContactSubmit}>
                {contactBanner && (
                  <div className={`banner show ${contactBanner.type}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {contactBanner.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4m0 4h.01M10.3 3.86l-8.2 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-2.94l-8.2-14.2a2 2 0 0 0-3.4 0z"
                        />
                      )}
                    </svg>
                    <span>{contactBanner.message}</span>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="contactName">Full name <span className="req">*</span></label>
                  <div className={`input-shell ${contactErrors.name ? 'invalid' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      value={contactForm.name}
                      onChange={(e) => {
                        setContactForm((prev) => ({ ...prev, name: e.target.value }));
                        setContactErrors((prev) => ({ ...prev, name: '' }));
                      }}
                    />
                  </div>
                  <span className="error-text">{contactErrors.name || ''}</span>
                </div>

                <div className="field">
                  <label htmlFor="contactEmail">Email address <span className="req">*</span></label>
                  <div className={`input-shell ${contactErrors.email ? 'invalid' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                    </svg>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      placeholder="jane@email.com"
                      autoComplete="email"
                      value={contactForm.email}
                      onChange={(e) => {
                        setContactForm((prev) => ({ ...prev, email: e.target.value }));
                        setContactErrors((prev) => ({ ...prev, email: '' }));
                      }}
                    />
                  </div>
                  <span className="error-text">{contactErrors.email || ''}</span>
                </div>

                <div className="field">
                  <label htmlFor="contactMessage">Message <span className="req">*</span></label>
                  <div className={`input-shell ${contactErrors.message ? 'invalid' : ''}`} style={{ alignItems: 'flex-start' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '3px' }}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      />
                    </svg>
                    <textarea
                      id="contactMessage"
                      name="contactMessage"
                      rows={4}
                      placeholder="How can we help?"
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        font: 'inherit',
                        resize: 'vertical',
                        background: 'transparent',
                      }}
                      value={contactForm.message}
                      onChange={(e) => {
                        setContactForm((prev) => ({ ...prev, message: e.target.value }));
                        setContactErrors((prev) => ({ ...prev, message: '' }));
                      }}
                    />
                  </div>
                  <span className="error-text">{contactErrors.message || ''}</span>
                </div>

                <button className="btn btn-primary btn-block" type="submit">
                  Send message
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer type="home" />
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

