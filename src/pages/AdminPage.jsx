import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('donors'); // 'donors' | 'requests'
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Management Console — BloodConnect';
    const cleanup = initAnimations();
    fetchAll();
    return cleanup;
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [donorsRes, requestsRes] = await Promise.all([
        supabase.from('donors').select('*').order('created_at', { ascending: false }),
        supabase.from('requests').select('*').order('created_at', { ascending: false }),
      ]);

      if (donorsRes.error) console.error('Donors fetch error:', donorsRes.error);
      if (requestsRes.error) console.error('Requests fetch error:', requestsRes.error);

      setDonors(donorsRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle Donor Availability
  const handleToggleAvailability = async (id, currentVal) => {
    try {
      const { error } = await supabase
        .from('donors')
        .update({ availability: !currentVal, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, availability: !currentVal } : d))
      );
      showToast('Donor status updated.');
    } catch (err) {
      showToast('Error updating donor.');
    }
  };

  // Delete Donor
  const handleDeleteDonor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donor record?')) return;
    try {
      const { error } = await supabase.from('donors').delete().eq('id', id);
      if (error) throw error;
      setDonors((prev) => prev.filter((d) => d.id !== id));
      showToast('Donor record removed.');
    } catch (err) {
      showToast('Error removing donor.');
    }
  };

  // Update Request Status
  const handleUpdateRequestStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      showToast(`Request marked as ${newStatus}.`);
    } catch (err) {
      showToast('Error updating request status.');
    }
  };

  // Delete Request
  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const { error } = await supabase.from('requests').delete().eq('id', id);
      if (error) throw error;
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('Request record removed.');
    } catch (err) {
      showToast('Error removing request.');
    }
  };

  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.availability).length;
  const totalRequests = requests.length;
  const openRequests = requests.filter((r) => r.status === 'Open').length;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        <section className="camps-hero" style={{ padding: '3rem 1.5rem 2rem' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span className="badge badge-accent" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
              Administration
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)', margin: '0 0 0.5rem' }}>
              System Admin Console
            </h1>
            <p style={{ color: 'var(--slate-600, #475569)', margin: 0 }}>
              Full management access to BloodConnect donor registries, urgent requests, and platform activity.
            </p>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Donors</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>{totalDonors}</div>
              </div>
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Available Donors</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>{availableDonors}</div>
              </div>
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Requests</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>{totalRequests}</div>
              </div>
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Open Requests</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--red-600)' }}>{openRequests}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <section style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', padding: '0 1rem' }}>
            <button
              onClick={() => setActiveTab('donors')}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === 'donors' ? 'var(--red-600)' : 'var(--slate-600)',
                borderBottom: activeTab === 'donors' ? '3px solid var(--red-600)' : '3px solid transparent',
              }}
            >
              Donors ({donors.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === 'requests' ? 'var(--red-600)' : 'var(--slate-600)',
                borderBottom: activeTab === 'requests' ? '3px solid var(--red-600)' : '3px solid transparent',
              }}
            >
              Blood Requests ({requests.length})
            </button>
          </div>
        </section>

        {/* Tab Content */}
        <section style={{ padding: '2.5rem 1rem', background: 'var(--slate-50, #f8fafc)', minHeight: '450px' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>Loading admin data…</p>
            ) : activeTab === 'donors' ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {donors.length === 0 ? (
                  <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>No donors registered yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Name</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Blood</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>City</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Phone</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Availability</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((d) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                            {d.name}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontWeight: 700, color: 'var(--red-600)' }}>{d.blood_group}</span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>{d.city}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <a href={`tel:${d.phone}`} style={{ color: 'var(--slate-800)', textDecoration: 'none' }}>
                              {d.phone}
                            </a>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => handleToggleAvailability(d.id, d.availability)}
                              style={{
                                border: 'none',
                                background: d.availability ? '#dcfce7' : '#f1f5f9',
                                color: d.availability ? '#15803d' : '#64748b',
                                padding: '0.3rem 0.7rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              {d.availability ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => handleDeleteDonor(d.id)}
                              style={{
                                border: '1px solid #fca5a5',
                                background: 'transparent',
                                color: '#b91c1c',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {requests.length === 0 ? (
                  <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>No requests posted yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Blood</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Hospital / City</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Urgency</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Phone</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--red-600)' }}>{r.blood_group}</span> ({r.units}u)
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{r.hospital}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{r.city}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: r.urgency === 'Critical' ? '#fee2e2' : r.urgency === 'Urgent' ? '#fef3c7' : '#e0f2fe',
                                color: r.urgency === 'Critical' ? '#b91c1c' : r.urgency === 'Urgent' ? '#b45309' : '#0369a1',
                              }}
                            >
                              {r.urgency}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <a href={`tel:${r.contact_phone}`} style={{ color: 'var(--slate-800)', textDecoration: 'none' }}>
                              {r.contact_phone}
                            </a>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateRequestStatus(r.id, e.target.value)}
                              style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            >
                              <option value="Open">Open</option>
                              <option value="Fulfilled">Fulfilled</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => handleDeleteRequest(r.id)}
                              style={{
                                border: '1px solid #fca5a5',
                                background: 'transparent',
                                color: '#b91c1c',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

