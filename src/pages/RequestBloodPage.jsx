import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../utils/toast';
import { initAnimations } from '../utils/animations';

export default function RequestBloodPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    bloodGroup: '',
    units: 1,
    hospital: '',
    city: '',
    urgency: 'Standard',
    contactPhone: '',
    note: '',
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Request Blood — BloodConnect';
    const cleanup = initAnimations();
    return cleanup;
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required.';
    if (!formData.units || Number(formData.units) < 1) newErrors.units = 'At least 1 unit is required.';
    if (!formData.hospital.trim()) newErrors.hospital = 'Hospital or clinic name is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBanner({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      const { error } = await supabase.from('requests').insert({
        user_id: user.id,
        blood_group: formData.bloodGroup,
        units: parseInt(formData.units, 10),
        hospital: formData.hospital.trim(),
        city: formData.city.trim(),
        urgency: formData.urgency,
        contact_phone: formData.contactPhone.trim(),
        note: formData.note.trim() || null,
        status: 'Open',
      });

      if (error) {
        setBanner({ type: 'error', message: error.message || 'Failed to submit blood request.' });
        setIsSubmitting(false);
        return;
      }

      setBanner({ type: 'success', message: 'Blood request posted successfully!' });
      showToast('Blood request submitted!');

      setTimeout(() => {
        navigate('/requests');
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              <div className="card-head">
                <h2>Post a Blood Request</h2>
                <p>Broadcast an urgent or standard blood requirement to our network of donors.</p>
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

              <form id="requestForm" noValidate onSubmit={handleSubmit}>
                <div className="field-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="field">
                    <label htmlFor="bloodGroup">
                      Blood Group Needed <span className="req">*</span>
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
                    <label htmlFor="units">
                      Units Required <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.units ? 'invalid' : ''}`}>
                      <input
                        type="number"
                        id="units"
                        min="1"
                        max="20"
                        value={formData.units}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.units || ''}</span>
                  </div>
                </div>

                <div className="field-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="field">
                    <label htmlFor="urgency">
                      Urgency Level <span className="req">*</span>
                    </label>
                    <div className="input-shell">
                      <select
                        id="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                      >
                        <option value="Standard">Standard (Within 24–48 hours)</option>
                        <option value="Urgent">Urgent (Within 6–12 hours)</option>
                        <option value="Critical">Critical (Immediate / Emergency)</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contactPhone">
                      Contact Phone <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.contactPhone ? 'invalid' : ''}`}>
                      <input
                        type="tel"
                        id="contactPhone"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.contactPhone || ''}</span>
                  </div>
                </div>

                <div className="field-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="field">
                    <label htmlFor="hospital">
                      Hospital / Clinic Name <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.hospital ? 'invalid' : ''}`}>
                      <input
                        type="text"
                        id="hospital"
                        placeholder="e.g. City General Hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.hospital || ''}</span>
                  </div>

                  <div className="field">
                    <label htmlFor="city">
                      City / Location <span className="req">*</span>
                    </label>
                    <div className={`input-shell ${errors.city ? 'invalid' : ''}`}>
                      <input
                        type="text"
                        id="city"
                        placeholder="e.g. Mumbai, Bandra"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="error-text">{errors.city || ''}</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="note">Additional Notes / Patient Details (Optional)</label>
                  <div className="input-shell" style={{ height: 'auto', minHeight: '80px', padding: '0.5rem' }}>
                    <textarea
                      id="note"
                      rows={3}
                      placeholder="e.g. Patient admitted in ICU, bed 14, contact relative directly"
                      value={formData.note}
                      onChange={handleChange}
                      style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  disabled={isSubmitting}
                  style={{ marginTop: '1.5rem' }}
                >
                  {isSubmitting ? 'Posting…' : 'Submit Blood Request'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer type="compact" />
    </>
  );
}

