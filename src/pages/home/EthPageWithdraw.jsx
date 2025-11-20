import React, { useState, useEffect } from "react";
import axios from "axios";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import { useAuth } from "../../context/AuthContext";
import './usdtPage.css'; // Подключаем файл с кастомными стилями

const EthPageWithdraw = () => {

  const [address, setAddress] = useState(""); // Адрес для вывода
  const [withdrawAmount, setWithdrawAmount] = useState(""); // Сумма для вывода
  const [balance, setBalance] = useState(0); // Баланс пользователя
  const [message, setMessage] = useState(""); // Сообщение для пользователя
  const [loading, setLoading] = useState(false); // Статус загрузки
  const { user } = useAuth(); // Данные пользователя (например, user.id)

  // Получение cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Получение CSRF токена
  const getCsrfToken = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
      withCredentials: true,
    });
    return res.data.csrfToken;
  };

  // Функция для получения баланса
  const fetchBalances = async () => {
    setLoading(true);
    try {
      const token = getCookie('token'); // Получаем токен из cookies
      const csrfToken = await getCsrfToken(); // Получаем CSRF токен
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/binance/user/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'csrf-token': csrfToken,
        },
        withCredentials: true,
      });
      // Устанавливаем баланс только для USDT
      setBalance(res?.data?.balance?.ETH || 0);
    } catch (err) {
      console.error("Ошибка получения баланса:", err);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  // Вызываем fetchBalances при монтировании компонента
  useEffect(() => {
    fetchBalances();
  }, []); // Вызываем только один раз при монтировании компонента

  // Функция для отправки данных на backend
  const handleWithdraw = async () => {
    // Проверка, достаточно ли средств для вывода
    if (parseFloat(withdrawAmount) > balance) {
      setMessage("You do not have sufficient funds to complete the withdrawal.");
      return;
    }

    if (!address) {
      setMessage("Enter the withdrawal address.");
      return;
    }

    if (parseFloat(withdrawAmount) <= 0) {
      setMessage("Please enter the correct withdrawal amount.");
      return;
    }

    // Отправка данных на сервер
    try {
      setMessage("Submitting withdrawal request...");
      const token = getCookie('token'); // Получаем токен из cookies
      const csrfToken = await getCsrfToken(); 

      // Используем axios для отправки POST-запроса
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/money/withdraw`, 
        {
          address,
          amount: withdrawAmount,
          userId: user.id, // Отправляем userId для идентификации пользователя
          currency: "ETH", // Валюта по умолчанию (USDT)
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "csrf-token": csrfToken, // CSRF токен
          },
          withCredentials: true, // Для отправки куки
        }
      );

      if (response.status === 200) {
        setMessage("Your withdrawal request has been accepted. Please wait for confirmation from the administration (up to 24 hours).");
      } else {
        setMessage(response.data.message || "Error while submitting withdrawal request.");
      }
    } catch (error) {
      console.error("Error with the request: ", error);
      setMessage("An error occurred while submitting the request. Please try again.");
    }
  };

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <h2 className="title">Withdraw ETH</h2>

        {/* Поле для ввода адреса кошелька */}
        <div className="withdraw-container">
          <label htmlFor="address" className="withdraw-label">
            Enter wallet address for withdrawal:
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="withdraw-input"
            placeholder="Enter wallet address"
          />
        </div>

        {/* Поле для ввода суммы */}
        <div style={{paddingTop:'2%'}} className="withdraw-container">
          <label htmlFor="withdrawAmount" className="withdraw-label">
            Enter amount to withdraw:
          </label>
          <input
            id="withdrawAmount"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="withdraw-input"
            placeholder="Amount"
          />
        </div>

        {/* Показать текущий баланс */}
        <div className="balance-info">
          <p>Current balance: {loading ? "Loading..." : `${balance} ETH`}</p>
        </div>

        {/* Кнопка для отправки запроса на вывод */}
        <div className="withdraw-button-container">
          <button onClick={handleWithdraw} className="withdraw-button">
            Withdraw
          </button>
        </div>

        {/* Сообщение о статусе */}
        {message && <div className="status-message">{message}</div>}

        {/* Подсказки */}
        <div className="hint-container">
          <p className="hint-title">Hint</p>
          <p className="hint-text">
            1. Please select the above-mentioned token system and currency type and transfer the corresponding amount for deposit. Please do not transfer any other irrelevant assets, otherwise they will not be retrieved.
          </p>
          <p className="hint-text">
            2. After you recharge the above address, you need to confirm the entire network node before it can be credited.
          </p>
          <p className="hint-text">
            3. Please make sure that your computer and browser are safe to prevent information from being tampered with or leaked.
          </p>
          <p className="hint-text">
            4. The above deposit address is the official payment address of the platform, please look for the official deposit address of the platform, and the loss of funds caused by incorrect charging shall be borne by yourself.
          </p>
        </div>
      </div>
      <UserBottomNavigation user={{ user }} />
    </div>
  );
};

export default EthPageWithdraw;
