import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';

export default function RequestsPage() {
  const { user, role } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodFilter, setBloodFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Open');

  useEffect(() => {
    document.title = 'Blood Requests — BloodConnect';
    const cleanup = initAnimations();
    fetchRequests();
    return cleanup;
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load blood requests:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkFulfilled = async (id) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: 'Fulfilled', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      showToast('Request marked as Fulfilled!');
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Fulfilled' } : r))
      );
    } catch (err) {
      showToast('Failed to update status.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const { error } = await supabase.from('requests').delete().eq('id', id);
      if (error) throw error;
      showToast('Request deleted.');
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showToast('Failed to delete request.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (bloodFilter && r.blood_group !== bloodFilter) return false;
    if (urgencyFilter && r.urgency !== urgencyFilter) return false;
    if (statusFilter && statusFilter !== 'All' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        {/* Hero Section */}
        <section className="camps-hero" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge badge-accent" style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
              Urgent Requirements
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)', margin: '0 0 1rem' }}>
              Active Blood Requests
            </h1>
            <p style={{ maxWidth: '650px', margin: '0 auto 2rem', color: 'var(--slate-600, #475569)', fontSize: '1.1rem' }}>
              Patients and hospitals urgently seeking blood donations. Review the requests below and reach out directly to save a life.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/request-blood" className="btn btn-primary btn-sm">
                + Post a Blood Request
              </Link>
              <Link to="/donors" className="btn btn-outline btn-sm">
                Browse Available Donors
              </Link>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1.2rem 1rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
              <select
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
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

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option value="">All Urgency Levels</option>
                <option value="Critical">Critical</option>
                <option value="Urgent">Urgent</option>
                <option value="Standard">Standard</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option value="Open">Open Requests Only</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="All">All Statuses</option>
              </select>
            </div>
          </div>
        </section>

        {/* Request Cards */}
        <section style={{ padding: '3rem 1rem', background: 'var(--slate-50, #f8fafc)', minHeight: '400px' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                <p>Loading requests…</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>No requests found</h3>
                <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                  There are currently no blood requests matching your filters.
                </p>
                <Link to="/request-blood" className="btn btn-primary btn-sm">
                  Create a Blood Request
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredRequests.map((req) => {
                  const isOwner = user?.id === req.user_id || role === 'admin';
                  const urgencyColors = {
                    Critical: { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
                    Urgent: { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
                    Standard: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
                  };
                  const color = urgencyColors[req.urgency] || urgencyColors.Standard;

                  return (
                    <div
                      key={req.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <span
                            style={{
                              background: 'var(--red-50, #fff1f2)',
                              color: 'var(--red-600, #e11d48)',
                              border: '1px solid var(--red-200, #fecdd3)',
                              fontWeight: 800,
                              fontSize: '1.25rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '8px',
                            }}
                          >
                            {req.blood_group} ({req.units} {req.units === 1 ? 'Unit' : 'Units'})
                          </span>

                          <span
                            style={{
                              background: color.bg,
                              color: color.text,
                              border: `1px solid ${color.border}`,
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {req.urgency}
                          </span>
                        </div>

                        <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', color: 'var(--slate-900)' }}>
                          {req.hospital}
                        </h3>
                        <p style={{ margin: '0 0 0.8rem', fontSize: '0.9rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                          {req.city}
                        </p>

                        {req.note && (
                          <p
                            style={{
                              background: '#f8fafc',
                              borderLeft: '3px solid var(--red-500)',
                              padding: '0.6rem 0.8rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.88rem',
                              color: 'var(--slate-700)',
                              margin: '0 0 1rem',
                            }}
                          >
                            {req.note}
                          </p>
                        )}

                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                          <span>Status: </span>
                          <strong style={{ color: req.status === 'Open' ? '#16a34a' : '#64748b' }}>
                            {req.status}
                          </strong>
                          <span style={{ margin: '0 0.5rem' }}>•</span>
                          <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: isOwner ? '0.6rem' : 0 }}>
                          <a
                            href={`tel:${req.contact_phone}`}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call {req.contact_phone}
                          </a>
                        </div>

                        {isOwner && (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            {req.status === 'Open' && (
                              <button
                                onClick={() => handleMarkFulfilled(req.id)}
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                              >
                                Mark Fulfilled
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                            >
                              Delete
                            </button>
                          </div>
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

