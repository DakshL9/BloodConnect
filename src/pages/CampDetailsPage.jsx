import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CAMPS } from '../data/campsData';
import { initAnimations } from '../utils/animations';

export default function CampDetailsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const camp = CAMPS.find((c) => c.id === id) || CAMPS[0];

  useEffect(() => {
    document.title = `${camp.title} · BloodConnect Blood Bank`;
    const cleanup = initAnimations();
    return cleanup;
  }, [camp]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        <section className="details-page scene-parent">
          <div className="bg-scene" aria-hidden="true">
            <div className="bg-worldmap left"></div>
            <div className="bg-worldmap"></div>
            <div className="bg-cloud cloud-drift-a" style={{ top: '8%', left: '6%', width: '80px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
              </svg>
            </div>
            <div className="bg-hand" style={{ bottom: '0%', left: '-3%', width: '270px' }}>
              <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 200 L0 140 C10 110 30 95 55 92 C50 76 62 60 82 60 C78 44 92 28 110 30 C128 22 148 36 144 56 C164 54 176 72 166 90 C186 98 190 124 172 140 C166 160 140 168 116 160 C92 172 44 176 0 168 Z"
                  fill="var(--skin-1)"
                />
                <g className="cradled" transform="translate(90,60)">
                  <path
                    d="M28 9 C10 -12 -16 4 -9 28 C-2 50 28 68 28 68 C28 68 58 50 65 28 C72 4 46 -12 28 9 Z"
                    fill="var(--red-600)"
                  />
                  <path d="M22 26 h12 v10 h10 v12 h-10 v10 h-12 v-10 h-10 v-12 h10 z" fill="#fff" />
                </g>
              </svg>
            </div>
            <div className="bg-tube" style={{ top: '6%', right: '6%', width: '120px', height: '100px', opacity: 0.4 }}>
              <svg viewBox="0 0 140 120">
                <path className="tube-flow" d="M70 20 C40 -6 4 24 20 54 C34 80 60 82 70 100 C80 82 106 80 120 54 C136 24 100 -6 70 20 Z" />
              </svg>
            </div>
            <span className="bg-note" style={{ bottom: '22%', left: '2%', '--rot': '-4deg' }}>
              A gift from the heart ♥
            </span>
            <div className="bg-wave">
              <svg viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradDetails" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--wave-1)' }} />
                    <stop offset="55%" style={{ stopColor: 'var(--wave-2)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--wave-3)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C260,30 460,150 760,100 C1040,50 1260,160 1600,80 L1600,200 L0,200 Z"
                  fill="url(#waveGradDetails)"
                />
                <g fill="rgba(255,255,255,0.16)">
                  <ellipse className="bg-leaf" cx="70" cy="96" rx="10" ry="30" />
                  <ellipse className="bg-leaf" cx="92" cy="100" rx="8" ry="24" />
                  <ellipse className="bg-leaf" cx="1510" cy="88" rx="10" ry="30" />
                  <ellipse className="bg-leaf" cx="1488" cy="94" rx="8" ry="24" />
                </g>
              </svg>
            </div>
          </div>
          <div className="container">
            <Link className="back-link" to="/camps">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to all camps
            </Link>
            <article className="details-card reveal" id="detailsMount">
              <div className="pill-badge" style={{ margin: '0 auto 18px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h2>{camp.title}</h2>
              <p className="org">{camp.org}</p>
              <div className="details-list">
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </span>
                  <div>
                    <b>Date</b>
                    <span>{camp.dateLabel}</span>
                  </div>
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                    </svg>
                  </span>
                  <div>
                    <b>Required blood group(s)</b>
                    <span>{camp.bloodGroups.join(', ')}</span>
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
                    <b>Time</b>
                    <span>{camp.time}</span>
                  </div>
                </div>
                <div className="row">
                  <span className="icn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <div>
                    <b>Location</b>
                    <span>{camp.address}</span>
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
                    <b>Contact for more details</b>
                    <span>{camp.contactName}: {camp.contactPhone}</span>
                  </div>
                </div>
              </div>
              <p className="details-note">{camp.note}</p>
              <Link className="btn btn-primary btn-block" to="/register" style={{ marginTop: '22px' }}>
                Register now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          </div>
        </section>
      </main>

      <Footer type="compact" />
    </>
  );
}
