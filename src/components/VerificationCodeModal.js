import React, { useState } from 'react';
import axios from 'axios';
import './verificationCodeModal.css'; // Импортируем стили

const VerificationCodeModal = ({ isOpen, onClose, email, csrfToken }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-email`,
        { email_address: email, code },
        {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': csrfToken, // ✅ include CSRF token
          },
        }
      );
      setMessage('✅ Email verified successfully!');
      setTimeout(() => {
        onClose();
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-modal">
      <div className="verification-modal__content">
        <h2 className="verification-modal__title">Email Verification</h2>
        <p className="verification-modal__description">
          Enter the verification code sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit} className="verification-modal__form">
          <input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={loading}
            className="verification-modal__input"
          />
          <button type="submit" disabled={loading} className="verification-modal__button">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="verification-modal__button verification-modal__cancel-button"
          >
            Cancel
          </button>
        </form>
        {message && (
          <p
            className={`verification-modal__message ${
              message.startsWith('✅') ? 'success' : 'error'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationCodeModal;
