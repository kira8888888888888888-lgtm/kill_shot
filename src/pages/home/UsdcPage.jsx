import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import CodeSubmissionModal from "../../components/CodeSubmissionModal";
import './usdtPage.css'; // Подключаем файл с кастомными стилями

const UsdcPage = () => {
    const [address, setAddress] = useState("0x64a0EAf2A775C4878d611A3f6EaFd93B2B9dF519"); // TRC20 Address
    const [isCopied, setIsCopied] = useState(false); // Состояние для отслеживания, скопирован ли адрес
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для отображения модального окна
    const { user } = useAuth();
    
    // Функция для копирования адреса в буфер обмена
    const copyAddress = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(address) // Копируем адрес в буфер обмена
          .then(() => {
            setIsCopied(true); // Меняем состояние, когда копирование успешно
            setIsModalOpen(true); // Открываем модальное окно
            setTimeout(() => setIsCopied(false), 2000); // Возвращаем кнопку в исходное состояние через 2 секунды
          })
          .catch((err) => {
            console.error('Ошибка копирования: ', err); // Логируем ошибку, если не удалось скопировать
            alert('Ошибка при копировании. Попробуйте еще раз!');
          });
      } else {
        alert('Clipboard API недоступен в вашем браузере. Используйте современный браузер или HTTPS.');
      }
    };
  
    // Функция для закрытия модального окна
    const closeModal = () => {
      setIsModalOpen(false);
    };
  

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <h2 className="title">Deposit USDC (ERC20)</h2>

        {/* QR код */}
        <div className="qr-code-container">
          <img
            src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png"
            alt="Deposit QR Code"
            className="qr-code"
          />
        </div>
          {/* Модальное окно */}
            <CodeSubmissionModal 
              isOpen={isModalOpen} 
              closeModal={closeModal} 
            />

        {/* Адрес для копирования */}
        <div className="address-container">
          <p className="address-text">Scan or Copy the Address:</p>
          <div className="address-wrapper">
            <span className="address">{address}</span>
            <button
              onClick={copyAddress}
              className={`copy-button ${isCopied ? 'copied' : ''}`}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

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
        <UserBottomNavigation/>
    </div>
  );
};

export default UsdcPage;
