import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import './codeSubmissionModal.css'; // Подключение стилей для модального окна

const CodeSubmissionModal = ({ isOpen, closeModal }) => {

  const { user } = useAuth();
  const [binanceCode, setBinanceCode] = useState('');  // Состояние для хранения введенного кода
  const [binanceResponse,setBinanceResponse] = useState();
  
  const getCsrfToken = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
      withCredentials: true,
    });
    return res.data.csrfToken;
  };

  const handleCodeSubmit = async () => {

  try {
    const csrfToken = await getCsrfToken();  // Получаем CSRF токен
    const userId = user?.id;  // Идентификатор пользователя

    // Отправляем запрос на сервер
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/binance/save-binance-code`,
      { userId, binanceCode },
      {
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,  // CSRF токен
        },
        withCredentials: true,  // Для отправки куки с запросом
      }
    );

    // Проверяем успешный ответ
    if (response?.status === 200) {
      setBinanceResponse(response?.data?.message);
      setBinanceCode('');
      closeModal();
    } else {
      setBinanceResponse(response?.data?.message);
    }
  } catch (error) {
    console.error('Error:', error?.response?.data?.message);
    setBinanceResponse(error?.response?.data?.message);
  }
};

  if (!isOpen) return null; // Если окно не открыто, не рендерим компонент

  return (
    <div className="modal-overlay_bcode" onClick={closeModal}>
      <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal_content_about">Write your Binance wallet code</h2>
        <p className="modal_content_about_body">
          {binanceResponse ? binanceResponse : 'Dear customer, you have copied the code to top up your wallet, but we have a very serious warning: after payment, please write your Binance wallet code here. For example, if you paid with a USDT wallet, then your USDT wallet code. It could be a code like this: TAzNAt6YqihijXsLXJfoMy2JWVhzWJooWo'}
        </p>
        <input
          className="modal-input2"
          placeholder="Write your code here..."
          type="text"
          value={binanceCode}
          onChange={(e) => setBinanceCode(e.target.value)} // Обновляем состояние
        />
        <div className="modal-buttons">
          <button className="modal-button-save" onClick={handleCodeSubmit}>
            Submit Code
          </button>
          <button className="modal-button-close" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSubmissionModal;
