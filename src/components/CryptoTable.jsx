import React, { useState, useEffect, useCallback } from 'react';
import '../components/cryptoTable.css';

const initialCryptoData = [
  { pair: 'BTCUSDT', price: 111373.19, change24h: -1.35 },
  { pair: 'ETHUSDT', price: 3948.78, change24h: -0.77 },
  { pair: 'YFIUSDT', price: 4758.98, change24h: -0.58 },
  { pair: 'XRPUSDT', price: 2.5991, change24h: -0.17 },
  { pair: 'XAUUSD', price: 3926.495, change24h: -0.97 },
  { pair: 'ZECUSDT', price: 358.829, change24h: 13.59 },
  { pair: 'FILUSDT', price: 1.6203, change24h: 4.10 },
  { pair: 'DASHUSDT', price: 47.905, change24h: 4.67 },
];

function CryptoTable() {
  const [cryptoData, setCryptoData] = useState(initialCryptoData);

  // Используем useCallback, чтобы избежать создания новой функции на каждом рендере
  const fetchCryptoData = useCallback(() => {
    const updatedData = cryptoData.map(item => ({
      ...item,
      price: item.price + (Math.random() - 0.5) * 1000,  // случайные изменения
      change24h: (Math.random() - 0.5) * 10,
    }));

    setCryptoData(updatedData);
  }, [cryptoData]);

  useEffect(() => {
    const intervalId = setInterval(fetchCryptoData, 5000);  // обновление данных каждые 5 секунд

    return () => clearInterval(intervalId);  // очищаем интервал
  }, [fetchCryptoData]);  // добавляем fetchCryptoData как зависимость

  return (
    <div className="crypto-table">
      <div className="crypto-table-header">
        <div className="crypto-pair">Pair</div>
        <div className="crypto-price">Price</div>
        <div className="crypto-change">24h change</div>
      </div>

      {cryptoData?.map((item, index) => (
        <div className="crypto-table-row" key={index}>
          <div className="crypto-pair">{item?.pair}</div>
          <div className="crypto-price">{item?.price.toFixed(2)}</div>
          <div
            className="crypto-change"
            style={{ backgroundColor: item?.change24h >= 0 ? '#37b66a' : '#e53858' }}
          >
            {item?.change24h > 0 ? '+' : ''}{item?.change24h.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default CryptoTable;
