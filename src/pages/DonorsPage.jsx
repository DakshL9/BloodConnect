import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initAnimations } from '../utils/animations';

export default function DonorsPage() {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodFilter, setBloodFilter] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  useEffect(() => {
    document.title = 'Find Blood Donors — BloodConnect';
    const cleanup = initAnimations();
    fetchDonors();
    return cleanup;
  }, []);

  async function fetchDonors() {
    setLoading(true);
    try {
      let query = supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setDonors(data || []);
    } catch (err) {
      console.error('Failed to fetch donors:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredDonors = donors.filter((d) => {
    if (bloodFilter && d.blood_group !== bloodFilter) return false;
    if (onlyAvailable && !d.availability) return false;
    if (citySearch.trim()) {
      const matchCity = d.city?.toLowerCase().includes(citySearch.toLowerCase());
      const matchName = d.name?.toLowerCase().includes(citySearch.toLowerCase());
      if (!matchCity && !matchName) return false;
    }
    return true;
  });

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        {/* Header / Intro Banner */}
        <section className="camps-hero" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge badge-accent" style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
              Verified Donors
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)', margin: '0 0 1rem' }}>
              Find a Blood Donor
            </h1>
            <p style={{ maxWidth: '650px', margin: '0 auto 2rem', color: 'var(--slate-600, #475569)', fontSize: '1.1rem' }}>
              Connect directly with verified donors in your area. Every donation can save up to three lives.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register-donor" className="btn btn-primary btn-sm">
                Register as Donor
              </Link>
              <Link to="/request-blood" className="btn btn-outline btn-sm">
                Request Blood
              </Link>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 1rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ minWidth: '180px' }}>
                <select
                  value={bloodFilter}
                  onChange={(e) => setBloodFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                >
                  <option value="">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div style={{ minWidth: '220px', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Filter by city or donor name…"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-700)' }}>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--red-600, #e11d48)' }}
              />
              Available donors only
            </label>
          </div>
        </section>

        {/* Donors Grid */}
        <section style={{ padding: '3rem 1rem', background: 'var(--slate-50, #f8fafc)', minHeight: '400px' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                <p>Loading donors…</p>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>No donors found</h3>
                <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                  No registered donors match your current filter settings.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setBloodFilter('');
                    setCitySearch('');
                    setOnlyAvailable(false);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
                {filteredDonors.map((d) => {
                  const isSelf = user?.id === d.user_id;
                  return (
                    <div
                      key={d.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                              {d.name}
                            </h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                              </svg>
                              {d.city}
                            </span>
                          </div>

                          <span
                            style={{
                              background: 'var(--red-50, #fff1f2)',
                              color: 'var(--red-600, #e11d48)',
                              border: '1px solid var(--red-200, #fecdd3)',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                              padding: '0.3rem 0.75rem',
                              borderRadius: '8px',
                            }}
                          >
                            {d.blood_group}
                          </span>
                        </div>

                        <div style={{ marginBottom: '1.2rem', fontSize: '0.9rem', color: 'var(--slate-600)' }}>
                          <p style={{ margin: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>Status:</span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: d.availability ? '#16a34a' : '#64748b',
                                fontWeight: 600,
                              }}
                            >
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: d.availability ? '#16a34a' : '#94a3b8',
                                }}
                              />
                              {d.availability ? 'Available to donate' : 'Temporarily unavailable'}
                            </span>
                          </p>

                          {d.last_donated_date && (
                            <p style={{ margin: '0.3rem 0' }}>
                              <span style={{ fontWeight: 600 }}>Last Donated:</span> {d.last_donated_date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <a
                          href={`tel:${d.phone}`}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          Call {d.phone}
                        </a>
                        {isSelf && (
                          <Link to="/register-donor" className="btn btn-outline btn-sm" title="Edit your donor profile">
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

