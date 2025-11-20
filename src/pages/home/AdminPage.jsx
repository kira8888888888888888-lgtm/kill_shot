import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import './adminPage.css';

const AdminPage = () => {
  const [newBinanceCode, setNewBinanceCode] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Стейт для хранения сообщения
  const [csrfToken, setCsrfToken] = useState(null); // Стейт для CSRF токена

  // Получаем CSRF токен при монтировании компонента
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken); // Сохраняем CSRF токен в состояние
      } catch (error) {
        console.error("Ошибка при получении CSRF токена", error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Получаем список пользователей при монтировании компонента
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');  // Получаем токен администратора из localStorage

    if (!adminToken) {
      setError('Admin token is missing.');
      setLoading(false);
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`, // Добавляем токен в заголовок Authorization
      },
      withCredentials: true,
    })
    .then(response => {
      setUsers(response?.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    });
  }, []);

  const handleEditUser = (user) => {
    setEditedUser({ ...user });
    setEditUserId(user._id);
    setEditMode(true);
  };

  const handleSaveUser = () => {
    if (!csrfToken) return; // Проверяем, что CSRF токен уже загружен

    const adminToken = localStorage.getItem('adminToken'); // Токен администратора

    axios.put(
        `${process.env.REACT_APP_API_URL}/admin/users/${editUserId}`, 
        editedUser,
        {
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrfToken,  // CSRF токен
                'Authorization': `Bearer ${adminToken}`, // Добавляем токен для авторизации
            }, 
            withCredentials: true 
        }
    )
      .then(response => {
        setUsers(users.map(user => (user._id === editUserId ? response.data : user)));
        setEditMode(false);
        setEditUserId(null);
      })
      .catch(err => console.error('Error saving user:', err));
  };

  const handleDeleteUser = (id) => {
    if (!csrfToken) return; // Проверяем, что CSRF токен уже загружен

    const adminToken = localStorage.getItem('adminToken'); // Токен администратора

    axios.delete(`${process.env.REACT_APP_API_URL}/admin/users/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrfToken,  // CSRF токен
                'Authorization': `Bearer ${adminToken}`, // Добавляем токен для авторизации
            }, 
            withCredentials: true 
        }
    )
      .then(() => setUsers(users.filter(user => user._id !== id)))
      .catch(err => console.error('Error deleting user:', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Обработка балансов (balances.XXX)
    if (name.startsWith('balances.')) {
      const key = name.split('.')[1];
      setEditedUser(prev => ({
        ...prev,
        balances: { ...prev.balances, [key]: value }
      }));
    } else {
      setEditedUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (!csrfToken) {
      return; // Prevent sending the request if no CSRF token is available
    }

    const adminToken = localStorage.getItem('adminToken'); // Токен администратора

    if (!message.trim()) {
      alert('Please enter a message before sending.');
      return;
    }

    axios.post(
      `${process.env.REACT_APP_API_URL}/admin/sendMessage`, 
      {
        userId: editUserId,
        message: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,  // CSRF токен
          'Authorization': `Bearer ${adminToken}`, // Добавляем токен для авторизации
        },
        withCredentials: true
      }
    )
      .then(response => {
        alert('Message sent successfully!');
        setMessage("");  // Clear the input field after sending
      })
      .catch(err => {
        console.error('Error sending message:', err);
        alert('Failed to send message.');
      });
  };

  const handleClosePanel = () => setEditMode(false);

  // Обработчик изменения вывода (withdrawals)
  const handleEditWithdraw = (withdrawId, field, value) => {
    setEditedUser(prevState => ({
      ...prevState,
      withdrawHistory: prevState.withdrawHistory.map(withdraw =>
        withdraw._id === withdrawId
          ? { ...withdraw, [field]: value }  // Изменяем поле в истории вывода
          : withdraw
      )
    }));
  };
  // Функция для удаления вывода
const handleDeleteWithdraw = (withdrawId) => {
  if (!csrfToken) return; // Проверяем, что CSRF токен есть

  const adminToken = localStorage.getItem('adminToken'); // Токен администратора

  axios.delete(
    `${process.env.REACT_APP_API_URL}/admin/withdraw/${editUserId}/${withdrawId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,  // CSRF токен
        'Authorization': `Bearer ${adminToken}`, // Токен администратора
      },
      withCredentials: true
    }
  )
  .then(() => {
    // Обновляем withdrawHistory на клиенте после удаления
    setEditedUser(prevState => ({
      ...prevState,
      withdrawHistory: prevState.withdrawHistory.filter(withdraw => withdraw._id !== withdrawId)
    }));
  })
  .catch(err => {
    alert('Failed to delete withdrawal.');
  });
};
// Добавляем обработчик для удаления пользователя из invitedFriends
const handleRemoveFriend = (friendId) => {
  if (!csrfToken) return; // Проверяем, что CSRF токен есть

  const adminToken = localStorage.getItem('adminToken'); // Токен администратора

  axios.put(
    `${process.env.REACT_APP_API_URL}/admin/removeFriend/${editUserId}`, // Добавляем новый маршрут
    { friendId },
    {
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,  // CSRF токен
        'Authorization': `Bearer ${adminToken}`, // Токен администратора
      },
      withCredentials: true
    }
  )
  .then(() => {
    // Обновляем список друзей в editedUser
    setEditedUser(prevState => ({
      ...prevState,
      invitedFriends: prevState.invitedFriends.filter(friend => friend !== friendId),
    }));
  })
  .catch(err => {
    alert('Failed to remove friend.');
  });
};

const filteredUsers = users.filter(user => 
  (user?.email_address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (user?._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
  (Array.isArray(user?.binanceCodes) && user?.binanceCodes.some(code => 
    typeof code === 'string' && code.toLowerCase().includes(searchTerm.toLowerCase())
  )) ||
  // Check if any invited friend's ID contains the search term
  (user?.invitedFriends?.some(friendId => 
    typeof friendId === 'string' && friendId.toLowerCase().includes(searchTerm.toLowerCase())
  ))
);


const handleRemoveBinanceCode = (binanceCode) => {
  if (!csrfToken) {
    return;
  }

  const adminToken = localStorage.getItem('adminToken');
  
  axios.put(
    `${process.env.REACT_APP_API_URL}/admin/removeBinanceCode/${editUserId}`,
    { binanceCode }, // 'binanceCode' is the code you want to remove
    {
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,
        'Authorization': `Bearer ${adminToken}`,
      },
      withCredentials: true
    }
  )
    .then(response => {
      setEditedUser(response.data);
    })
    .catch(err => {
      console.error('Error removing Binance code:', err);
      alert('Failed to remove Binance code.');
    });
};

return (
  <div className="admin-panel">
    <h1 className="admin-panel__title">Admin Panel</h1>
    <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Email or User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />    
    </div>
    <h2 className="admin-panel__subtitle">Users</h2>

    {loading && <LoadingSpinner />}
    {error && !loading && <div className="error-message">{error}</div>}
    {!loading && !error && users.length === 0 && <div className="no-users-message">No users found</div>}
{!loading && !error && filteredUsers.length > 0 && (
  <ul className="user-list">
    {filteredUsers.map(user => (
      <li key={user._id} className="user-item">
        <div className="user-info">
          <span className="user-email">User ID: {user?._id}</span>
          <span className="user-email">Email: {user?.email_address}</span>
          <span className="user-verified">Verified: {user?.verified ? 'Yes' : 'No'}</span>
          <span className="user-binance-code">Binance Code: {user?.binanceCodes.join(' | ')}</span>
          <span className="user-binance-code">Friends ID: {user?.invitedFriends.join(' | ')}</span>
        </div>

        <div className="user-actions">
          <button className="btn btn-edit" onClick={() => handleEditUser(user)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDeleteUser(user?._id)}>Delete</button>
        </div>
      </li>
    ))}
  </ul>
)}

    {editMode && editedUser && (
      <div className="modal-overlay_admin" onClick={handleClosePanel}>
        <div className="edit-user-form modal-content_admin" onClick={e => e.stopPropagation()}>
          <div className="edit-user-form__header_admin">
            <h3 className="h3_admin">Edit User: {editedUser.email_address}</h3>
            <button className="close-btn_admin" onClick={handleClosePanel}>X</button>
          </div>
          <form className="form">
            {/* Редактируемые поля пользователя */}
            <div className="form-group_admin">
              <label>Email Address</label>
              <input
                className="form-input_admin"
                type="email"
                value={editedUser.email_address || ''}
                name="email_address"
                onChange={handleChange}
              />
            </div>
            <div className="form-group_admin">
              <label>Verified</label>
              <input
                className="form-checkbox_admin"
                type="checkbox"
                checked={editedUser.verified || false}
                name="verified"
                onChange={e => setEditedUser({ ...editedUser, verified: e.target.checked })}
              />
            </div>

            {/* Балансы */}
            <div className="form-group_admin">
              <label>Balances</label>
              <div className="balances-inputs_admin">
                {['USDT', 'ETH', 'BTC', 'USDC', 'DAI'].map((currency) => (
                  <div className="balance-item_admin" key={currency}>
                    <p className="balance-label_admin">{currency}</p>
                    <input
                      className="form-input_admin balance-input_admin"
                      placeholder={currency}
                      type="number"
                      value={editedUser.balances?.[currency] || ''}
                      name={`balances.${currency}`}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Сообщение */}
            <div className="form-group_admin">
              <label>Message</label>
              <textarea
                className="form-input_admin message-input_admin"
                placeholder="Write a message to this user"
                value={message}
                onChange={handleMessageChange}
                rows="4"
              />
            </div>

            {/* История выводов */}
            <div className="form-group_admin">
              <label>Withdraw History</label>
              <div className="withdraw-history_admin">
                {editedUser.withdrawHistory && editedUser.withdrawHistory.length > 0 ? (
                  <ul className="withdraw-list_admin">
                    {editedUser.withdrawHistory.map((withdraw, index) => (
                      <li key={withdraw._id} className="withdraw-item_admin">
                        <p>{withdraw?.currency}</p>
                        <input
                          type="number"
                          value={withdraw.amount}
                          onChange={(e) => handleEditWithdraw(withdraw._id, 'amount', e.target.value)}
                        />
                        <input
                          type="text"
                          value={withdraw.address}
                          onChange={(e) => handleEditWithdraw(withdraw._id, 'address', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-delete"
                          onClick={() => handleDeleteWithdraw(withdraw._id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No withdrawal history available.</p>
                )}
              </div>
            </div>

            {/* Список друзей */}
            <div className="form-group_admin">
              <label>Invited Friends</label>
              <ul className="invited-friends-list_admin">
                {editedUser?.invitedFriends && editedUser?.invitedFriends?.length > 0 ? (
                  editedUser?.invitedFriends?.map((friendId) => (
                    <li key={friendId} className="invited-friend-item_admin">
                      <span>Friend ID: {friendId}</span>
                      <button
                        type="button"
                        className="btn btn-remove-friend"
                        onClick={() => handleRemoveFriend(friendId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No invited friends.</p>
                )}
              </ul>
            </div>
{/* Binance Codes */}
<div className="form-group_admin">
  <label>Binance Codes</label>
  <div className="binance-codes-inputs_admin">
    {editedUser.binanceCodes?.map((code, index) => (
      <div key={index} className="binance-code-item_admin">
        <input
          className="form-input_admin"
          type="text"
          value={code}
          readOnly
          style={{width:'80%'}}
        />
        <button
          type="button"
          className="btn btn-delete"
          onClick={() => handleRemoveBinanceCode(code)}
        >
          Remove
        </button>
      </div>
    ))}
  </div>
</div>



            <div className="form-actions_admin">
              <button type="button" className="btn_admin btn-save_admin" onClick={handleSaveUser}>Save User</button>
              <button type="button" className="btn_admin btn-send-message_admin" onClick={handleSendMessage}>Send Message</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default AdminPage;
