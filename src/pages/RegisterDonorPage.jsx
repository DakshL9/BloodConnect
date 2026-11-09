import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';

export default function RegisterDonorPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    phone: '',
    city: '',
    availability: true,
    lastDonatedDate: '',
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    document.title = 'Donor Registration & Profile — BloodConnect';
    const cleanup = initAnimations();

    async function loadDonor() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setIsExisting(true);
          setFormData({
            name: data.name || profile?.full_name || '',
            bloodGroup: data.blood_group || '',
            phone: data.phone || '',
            city: data.city || '',
            availability: data.availability ?? true,
            lastDonatedDate: data.last_donated_date || '',
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            name: profile?.full_name || user.user_metadata?.full_name || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching donor:', err);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadDonor();
    return cleanup;
  }, [user, profile]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBanner({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      const payload = {
        user_id: user.id,
        name: formData.name.trim(),
        blood_group: formData.bloodGroup,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        availability: formData.availability,
        last_donated_date: formData.lastDonatedDate || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('donors').upsert(payload, { onConflict: 'user_id' });

      if (error) {
        setBanner({ type: 'error', message: error.message || 'Failed to save donor record.' });
        setIsSubmitting(false);
        return;
      }

      setBanner({
        type: 'success',
        message: isExisting ? 'Donor details updated successfully!' : 'Registered as a donor successfully!',
      });
      showToast(isExisting ? 'Profile updated!' : 'Donor registration complete!');

      setTimeout(() => {
        navigate('/donors');
      }, 1000);
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'An unexpected error occurred.' });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <main id="main">
        <section className="auth-page scene-parent">
          <div className="auth-card-wrap">
            <div className="auth-card reveal" style={{ maxWidth: '640px', margin: '2rem auto' }}>
              <div className="card-icon pulse-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.7 5c2 0 3.4 1 4.3 2.4C11 6 12.3 5 14.3 5c3.4 0 5.1 3.4 3.7 6.7C19.5 16.4 12 21 12 21z" />
                </svg>
              </div>

              <div className="card-head">
                <h2>{isExisting ? 'Update Donor Profile' : 'Register as a Blood Donor'}</h2>
                <p>
                  {isExisting
                    ? 'Manage your blood donation availability and contact information.'
                    : 'Help save lives by joining the BloodConnect verified donor registry.'}
                </p>
              </div>

              {banner && (
                <div className={`banner show ${banner.type}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {banner.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.86l-8.2 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-2.94l-8.2-14.2a2 2 0 0 0-3.4 0z" />
                    )}
                  </svg>
                  <span>{banner.message}</span>
                </div>
              )}

              {loadingInitial ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>Loading your donor profile…</p>
              ) : (
                <form id="donorForm" noValidate onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="name">
                      Full Name <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.name ? 'invalid' : ''}`}>
                      <input
                        type="text"
                        id="name"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.name || ''}</span>
                  </div>

                  <div className="field-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="field">
                      <label htmlFor="bloodGroup">
                        Blood Group <span className="req">*</span>
                      </label>
                      <div className={`input-shell ${errors.bloodGroup ? 'invalid' : ''}`}>
                        <select
                          id="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value="">Select blood group</option>
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
                      <span className="error-text">{errors.bloodGroup || ''}</span>
                    </div>

                    <div className="field">
                      <label htmlFor="phone">
                        Contact Phone <span className="req">*</span>
                      </label>
                      <div className={`input-shell ${errors.phone ? 'invalid' : ''}`}>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <span className="error-text">{errors.phone || ''}</span>
                    </div>
                  </div>

                  <div className="field-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="field">
                      <label htmlFor="city">
                        City / District <span className="req">*</span>
                      </label>
                      <div className={`input-shell ${errors.city ? 'invalid' : ''}`}>
                        <input
                          type="text"
                          id="city"
                          placeholder="e.g. Mumbai, Pune, Delhi"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <span className="error-text">{errors.city || ''}</span>
                    </div>

                    <div className="field">
                      <label htmlFor="lastDonatedDate">
                        Last Donated Date (Optional)
                      </label>
                      <div className="input-shell">
                        <input
                          type="date"
                          id="lastDonatedDate"
                          value={formData.lastDonatedDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field" style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        id="availability"
                        checked={formData.availability}
                        onChange={handleChange}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--red-600, #e11d48)' }}
                      />
                      <span>I am currently available to donate blood</span>
                    </label>
                    <p style={{ margin: '0.3rem 0 0 1.8rem', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      Uncheck this whenever you are resting, travelling, or temporarily unavailable.
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ marginTop: '1.5rem' }}
                  >
                    {isSubmitting ? 'Saving…' : isExisting ? 'Update Donor Profile' : 'Complete Registration'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer type="compact" />
    </>
  );
}

