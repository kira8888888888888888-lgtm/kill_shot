import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import UserBottomNavigation from "./UserBottomNavigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import withdraw from '../images/withdraw.png';
import deposit from '../images/deposit.png';
import addGroup from '../images/add-group.png';
import InviteFriendModal from './InviteFriendModal';
import LoadingSpinner from "./LoadingSpinner";
import './messagesForUsers.css';
import './myAssets.css';

const assets = [
  { name: "USDT", img: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" },
  { name: "ETH", img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" },
  { name: "BTC", img: "https://s3.coinmarketcap.com/static-gravity/image/6fbea0356edd48a4a68a4b877195443c.png" },
  { name: "USDC", img: "https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" },
  { name: "DAI", img: "https://s3.coinmarketcap.com/static-gravity/image/47f58ac1aa854d448df91ea0e6fbfe6f.png" }
];

const assetPrices = {
  BTC: 103471,
  ETH: 3485,
  USDT: 1,
  USDC: 1,
  DAI: 1
};

const assetsDatas = [
  { textName: "withdraw", img: withdraw, link: "/assets/withdraw" },
  { textName: "recharge", img: deposit, link: "/assets/deposit" },
];

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
};

const getCsrfToken = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
    withCredentials: true,
  });
  return res.data.csrfToken;
};

const MyAssets = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [userId, setUserId] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [balances, setBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(true);

  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  const token = useMemo(() => getCookie('token'), []);

  // ---- Получение балансов ----
  const fetchBalances = useCallback(async () => {
    setLoadingBalances(true);
    try {
      const csrfToken = await getCsrfToken();
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/binance/user/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'csrf-token': csrfToken,
        },
        withCredentials: true,
      });

      setUserId(res.data?.userId);
      setBalances(res.data?.balance || {});
    } catch {
      setBalances({});
    } finally {
      setLoadingBalances(false);
    }
  }, [token]);

  // ---- Получение сообщения админа ----
  const fetchMessage = useCallback(async () => {
    if (!user?.id) return;

    try {
      const csrfToken = await getCsrfToken();

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getMessage/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'csrf-token': csrfToken,
        },
        withCredentials: true,
      });

      if (res.data?.message && res.data.message !== localStorage.getItem("lastAdminMessage")) {
        setMessage(res.data.message);
        setIsModalOpen(true);
        localStorage.setItem("lastAdminMessage", res.data.message);
      }
    } catch (err) {

    } finally {
      setLoadingMessage(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  // ---- Мемоизация totalValue ----
  const totalValue = useMemo(() => {
    return Object.entries(balances).reduce((sum, [asset, balance]) => {
      const price = assetPrices[asset];
      return price ? sum + balance * price : sum;
    }, 0).toFixed(2);
  }, [balances]);

  // ---- Формат баланса ----
  const getBalance = useCallback(
    (assetName) => {
      const balance = balances[assetName] || 0;
      return isVisible ? balance.toFixed(2) : "****.**";
    },
    [balances, isVisible]
  );

  // ---- Копирование ID ----
  const copyAddress = () => {
    navigator.clipboard.writeText(userId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // ---- Закрытие модалки ----
  const closeModal = async () => {
    setIsModalOpen(false);

    if (!message) return;

    try {
      const csrfToken = await getCsrfToken();
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/deleteMessage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'csrf-token': csrfToken,
        },
        data: { userId: user?.id, message },
        withCredentials: true,
      });

      setMessage("");
      localStorage.removeItem("lastAdminMessage");
    } catch (err) {
     
    }
  };

  if (!userId) return <LoadingSpinner />;

  return (
    <div className="container">

      {/* --- HEADER / JSX НЕ ТРОГАЛ --- */}
      <div className="header">
        <div className="header-content">
          <div className="title">My assets</div>
          <div className="empty-space"></div>
        </div>

        <div className="asset-valuation">
          <div style={{ display: 'flex' }}>
            <p>Asset valuation</p>
            <span className="eye-icon" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <div className="valuation-amount">
            {loadingBalances ? "****.**" : isVisible ? totalValue : "****.**"}
          </div>

          <p className="valuation-estimate">
            ≈ {isVisible ? "$" + totalValue : "$****.**"}
          </p>
        </div>
      </div>

      {/* ID */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-evenly' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600' }}>Your ID </h2>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {userId}
        </span>
        <button
          onClick={copyAddress}
          style={{ marginTop: '4%' }}
          className={`copy-button ${isCopied ? 'copied' : ''}`}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* MESSAGE FROM ADMIN */}
      {isModalOpen && (
        <div className="modal-overlay_for_users">
          <div className="modal-content_for_users">
            <h3 className="modal-content_for_users_h3">Message from Admin:</h3>
            <p className="close-btn_for_users_p">{message}</p>
            <button onClick={closeModal} className="close-btn_for_users">Close</button>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="action-buttons">
        {assetsDatas.map(action => (
          <NavLink key={action.textName} to={action.link} className="action">
            <img src={action.img} alt={action.textName} />
            <div>
              {action.textName.charAt(0).toUpperCase() + action.textName.slice(1)}
            </div>
          </NavLink>
        ))}

        <div className="action active-link" onClick={() => setIsInviteModalOpen(true)}>
          <img src={addGroup} alt="" width='23px' height='23px' />
          <div style={{ paddingTop: '3%' }}>Invite Friends</div>
        </div>
      </div>

      <InviteFriendModal
        isOpen={isInviteModalOpen}
        closeModal={() => setIsInviteModalOpen(false)}
        currentUserId={user?.id}
      />

      {/* ASSETS */}
      <div className="account-section">
        <div className="asset-list">
          {assets.map(asset => (
            <div key={asset.name} className="asset-item">
              <div className="asset-info">
                <img src={asset.img} alt={asset.name} />
                <p>{asset.name}</p>
              </div>
              <div className="asset-balance">
                <div className="asset_balance_title">
                  Available balance: {getBalance(asset.name)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserBottomNavigation user={user} />
    </div>
  );
};

export default MyAssets;
