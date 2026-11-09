import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CAMPS } from '../data/campsData';
import { initAnimations } from '../utils/animations';

export default function CampsPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [selectedGroup, setSelectedGroup] = useState('all');

  useEffect(() => {
    document.title = 'Donation Camps — BloodConnect Blood Bank';
    const cleanup = initAnimations();
    return cleanup;
  }, []);

  const cities = useMemo(() => {
    return Array.from(new Set(CAMPS.map((c) => c.city))).sort();
  }, []);

  const filteredCamps = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return CAMPS.filter((camp) => {
      const matchesTerm =
        !term ||
        camp.title.toLowerCase().includes(term) ||
        camp.org.toLowerCase().includes(term) ||
        camp.address.toLowerCase().includes(term) ||
        camp.city.toLowerCase().includes(term);
      const matchesCity = selectedCity === 'all' || camp.city === selectedCity;
      const matchesGroup = selectedGroup === 'all' || camp.bloodGroups.includes(selectedGroup);
      return matchesTerm && matchesCity && matchesGroup;
    });
  }, [searchTerm, selectedCity, selectedGroup]);

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedGroup('all');
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        <section className="hero scene-parent" style={{ paddingBottom: '10px' }}>
          <div className="bg-scene" aria-hidden="true">
            <div className="bg-worldmap"></div>
            <div className="bg-cloud cloud-drift-a" style={{ top: '10%', left: '42%', width: '90px' }}>
              <svg viewBox="0 0 120 60">
                <ellipse cx="40" cy="38" rx="32" ry="20" fill="#fff" />
                <ellipse cx="70" cy="30" rx="26" ry="18" fill="#fff" />
                <ellipse cx="95" cy="40" rx="20" ry="14" fill="#fff" />
              </svg>
            </div>
            <div className="bg-hand drop" style={{ top: '-4%', right: '-2%', width: '230px' }}>
              <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M200 220 L200 150 C190 118 168 100 140 96 C150 80 142 60 120 56 C126 36 108 18 86 24 C64 14 40 30 44 52 C24 52 10 72 20 92 C2 100 -4 126 14 142 C18 164 44 176 70 168 C96 182 150 186 200 178 Z"
                  fill="var(--skin-1)"
                />
                <g className="cradled" transform="translate(58,2)">
                  <path
                    d="M30 10 C46 -12 78 0 74 24 C70 48 30 70 30 70 C30 70 -10 48 -14 24 C-18 0 14 -12 30 10 Z"
                    fill="var(--red-600)"
                  />
                  <path d="M22 26 h16 v12 h12 v16 h-12 v12 h-16 v-12 h-12 v-16 h12 z" fill="#fff" />
                </g>
              </svg>
            </div>
            <div className="bg-sparkle" style={{ top: '2%', right: '26%' }}>
              <span></span><span></span><span></span>
            </div>
            <span className="bg-note alt" style={{ top: '14%', right: '2%', '--rot': '4deg' }}>
              Donate today<br />for a healthier<br />tomorrow ♥
            </span>
            <div className="bg-wave">
              <svg viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradCamps" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--wave-1)' }} />
                    <stop offset="55%" style={{ stopColor: 'var(--wave-2)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--wave-3)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C260,30 460,150 760,100 C1040,50 1260,160 1600,80 L1600,200 L0,200 Z"
                  fill="url(#waveGradCamps)"
                  opacity="0.18"
                />
              </svg>
            </div>
          </div>
          <div className="container" style={{ paddingTop: '56px' }}>
            <p className="eyebrow">BE A DONOR</p>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.9rem)' }}>
              Blood <em style={{ color: 'var(--red-600)', fontStyle: 'normal' }}>donation camps</em>
            </h1>
            <p className="lede">Find and register for upcoming blood donation camps near you.</p>
          </div>
        </section>

        <div className="container">
          <div className="filter-bar reveal">
            <label className="field-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                id="campSearch"
                placeholder="Search for camps, blood banks, location…"
                aria-label="Search camps"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <label className="field-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <select
                id="cityFilter"
                aria-label="Filter by city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="all">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="field-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
              </svg>
              <select
                id="groupFilter"
                aria-label="Filter by blood group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="all">All blood groups</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
              </select>
            </label>
            <button className="btn btn-outline" id="clearFilters" type="button" onClick={handleClear}>
              Clear
            </button>
          </div>

          <p className="results-line" id="resultsLine">
            {filteredCamps.length === 0
              ? 'Showing 0 camps'
              : `Showing results for ${filteredCamps.length} camp${filteredCamps.length === 1 ? '' : 's'}`}
          </p>

          <section className="camp-grid reveal-group in-view" id="campGrid" style={{ marginBottom: '90px' }} aria-live="polite">
            {filteredCamps.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                No camps match your search yet. Try a different city or blood group.
              </div>
            ) : (
              filteredCamps.map((camp) => (
                <article key={camp.id} className="camp-card reveal-child">
                  <div className="camp-card-top">
                    <div className="date-badge">
                      <span className="d">{camp.day}</span>
                      <span className="m">{camp.month}</span>
                    </div>
                    <span className="status-pill">{camp.status}</span>
                  </div>
                  <div>
                    <h3>{camp.title}</h3>
                    <p className="org">{camp.org}</p>
                  </div>
                  <div className="camp-detail-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span>{camp.dateLabel}</span>
                  </div>
                  <div className="camp-detail-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                    </svg>
                    <span>{camp.time}</span>
                  </div>
                  <div className="camp-detail-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span>{camp.address}</span>
                  </div>
                  <div className="camp-detail-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z" />
                    </svg>
                    <span>Needed: {camp.bloodGroups.join(', ')} · {camp.registered} registered</span>
                  </div>
                  <div className="camp-card-actions">
                    <Link className="btn btn-outline btn-sm" to={`/camp-details?id=${encodeURIComponent(camp.id)}`}>
                      View details
                    </Link>
                    <Link className="btn btn-primary btn-sm" to="/register">
                      Register now
                    </Link>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>

      <Footer type="camps" />
    </>
  );
}
