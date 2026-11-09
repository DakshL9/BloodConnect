import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '../utils/toast';

export default function BookModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '2026-08-30',
    bloodGroup: '',
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const firstInputRef = useRef(null);

  const PHONE_RE = /^[+]?[0-9\s-]{7,15}$/;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (firstInputRef.current) {
        firstInputRef.current.focus({ preventScroll: true });
      }
    } else {
      document.body.style.overflow = '';
      setBanner(null);
      setErrors({});
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const keyMap = { bookName: 'name', bookPhone: 'phone', bookDate: 'date', bookBloodGroup: 'bloodGroup' };
    const stateKey = keyMap[id] || id;

    setFormData((prev) => ({ ...prev, [stateKey]: value }));
    setErrors((prev) => ({ ...prev, [stateKey]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!PHONE_RE.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }
    if (!formData.date.trim()) newErrors.date = 'Preferred date is required.';
    if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood group is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBanner({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setBanner({ type: 'success', message: "Appointment requested! We'll confirm by phone shortly." });
    showToast('Appointment request received!');

    setTimeout(() => {
      onClose();
      setFormData({
        name: '',
        phone: '',
        date: '2026-08-30',
        bloodGroup: '',
      });
      setBanner(null);
      setErrors({});
    }, 1500);
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      id="bookModal"
      onClick={(e) => {
        if (e.target.id === 'bookModal') onClose();
      }}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">
        <button
          type="button"
          className="modal-close"
          data-close-modal
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="bookModalTitle">Book your appointment</h2>
        <p className="lede">
          Reserve a slot at our next donation drive on August 30<sup>th</sup> at 10:00 AM. We'll confirm the details by phone.
        </p>

        <form id="bookForm" noValidate onSubmit={handleSubmit}>
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
            <label htmlFor="bookName">
              Full name <span className="req">*</span>
            </label>
            <div className={`input-shell ${errors.name ? 'invalid' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                ref={firstInputRef}
                type="text"
                id="bookName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <span className="error-text">{errors.name || ''}</span>
          </div>

          <div className="field">
            <label htmlFor="bookPhone">
              Phone number <span className="req">*</span>
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
                id="bookPhone"
                placeholder="+91 90000 00000"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <span className="error-text">{errors.phone || ''}</span>
          </div>

          <div className="form-grid">
            <div className="field full" style={{ marginBottom: 0 }}>
              <label htmlFor="bookDate">
                Preferred date <span className="req">*</span>
              </label>
              <div className={`input-shell ${errors.date ? 'invalid' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <input
                  type="date"
                  id="bookDate"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <span className="error-text">{errors.date || ''}</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="bookBloodGroup">
              Blood group <span className="req">*</span>
            </label>
            <div className={`input-shell ${errors.bloodGroup ? 'invalid' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z"
                />
              </svg>
              <select
                id="bookBloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select blood group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>
            <span className="error-text">{errors.bloodGroup || ''}</span>
          </div>

          <button className="btn btn-primary btn-block" type="submit">
            Confirm appointment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
