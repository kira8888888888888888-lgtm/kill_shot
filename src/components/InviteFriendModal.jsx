import React, { useState } from 'react';
import axios from 'axios';
import './inviteFriendModal.css';

// Модальное окно для приглашения друга
const InviteFriendModal = ({ isOpen, closeModal, currentUserId }) => {
  const [friendId, setFriendId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Добавим индикатор загрузки



  const getCsrfToken = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
      withCredentials: true,
    });
    return res.data.csrfToken;
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleInvite = async () => {
    if (!friendId) {
      setMessage("Friend ID is required!");
      return;
    }

    setLoading(true); // Начинаем загрузку

    try {
      const token = getCookie('token');
      const csrfToken = await getCsrfToken();
      // Отправляем запрос на сервер для добавления друга
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/invite-friend`,{currentUserId,friendId},{
          headers: { Authorization: `Bearer ${token}`, "csrf-token": csrfToken },
          withCredentials: true,
        });
      // Успешное добавление
      setMessage(response?.data?.message || 'Invitation Friend ID sent successfully!');
      setFriendId(''); // Очищаем поле
    } catch (error) {
      // Обработка ошибки
      setMessage(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay_invite">
        <div className="modal-content_invite">
          <div className="modal-header_invite">
            <h2>Invite Friend</h2>
            <button onClick={closeModal}>Close</button>
          </div>
          <div className="modal-body_invite">
            <input
              type="text"
              placeholder="Enter friend's ID"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
            />
            <button onClick={handleInvite} disabled={loading}>
              {loading ? 'Sending...' : 'Send Friend ID'}
            </button>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    )
  );
};

export default InviteFriendModal;
