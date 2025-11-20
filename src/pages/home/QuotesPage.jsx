import React, { useState, useEffect } from "react";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import "./quotesPage.css";
import { QRCodeCanvas } from "qrcode.react";

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState("Digital Currency");
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const { user } = useAuth();
  const [data, setData] = useState({
    "Digital Currency": [
      { pair: "BTCUSDT", price: 111373.19, change: -1.35 },
      { pair: "ETHUSDT", price: 3948.78, change: -0.77 },
      { pair: "ADAUSDT", price: 0.6519, change: 0.93 },
      { pair: "DOGEUSDT", price: 0.19606, change: 1.23 },
      { pair: "XRPUSDT", price: 2.5991, change: -0.17 },
      { pair: "DOTUSDT", price: 3.139, change: 2.58 },
      { pair: "SOLUSDT", price: 184.12, change: 4.1 },
      { pair: "LTCUSDT", price: 99.769, change: 3.22 },
      { pair: "LINKUSDT", price: 18.502, change: 3.74 },
      { pair: "BCHUSDT", price: 560.66, change: 0.55 },
      { pair: "FILUSDT", price: 1.6203, change: 4.1 },
      { pair: "ZECUSDT", price: 358.829, change: 13.59 },
      { pair: "TRXUSDT", price: 0.29728, change: 0.62 },
      { pair: "XLMUSDT", price: 0.312, change: 1.02 },
      { pair: "AVAXUSDT", price: 38.42, change: 2.95 },
      { pair: "ATOMUSDT", price: 10.24, change: 1.58 },
      { pair: "UNIUSDT", price: 12.38, change: 2.44 },
      { pair: "AAVEUSDT", price: 105.22, change: 0.65 },
      { pair: "YFIUSDT", price: 4758.98, change: -0.58 },
      { pair: "SANDUSDT", price: 0.482, change: 1.1 },
      { pair: "MANAUSDT", price: 0.388, change: 1.35 },
      { pair: "ICPUSDT", price: 12.74, change: 2.14 },
      { pair: "XMRUSDT", price: 162.45, change: -0.25 },
      { pair: "ETCUSDT", price: 34.29, change: 1.9 },
    ],
    Forex: [
      { pair: "EUR/USD", price: 1.0843, change: 0.12 },
      { pair: "GBP/USD", price: 1.2804, change: -0.08 },
      { pair: "USD/JPY", price: 150.93, change: 0.22 },
      { pair: "AUD/USD", price: 0.6623, change: -0.18 },
      { pair: "USD/CAD", price: 1.3625, change: 0.05 },
      { pair: "NZD/USD", price: 0.6011, change: 0.09 },
      { pair: "USD/CHF", price: 0.8967, change: 0.03 },
      { pair: "EUR/GBP", price: 0.8471, change: 0.04 },
    ],
    "Precious metals": [
      { pair: "XAU/USD", price: 3926.495, change: -0.97 },
      { pair: "XAG/USD", price: 47.619, change: 1.0 },
      { pair: "XPT/USD", price: 1592.509, change: 0.11 },
      { pair: "XPD/USD", price: 1404.999, change: -0.26 },
    ],
  });

  const tabs = Object.keys(data);

  // Фильтрация по поиску
  const filteredData = data[activeTab].filter((item) =>
    item.pair.toLowerCase().includes(search.toLowerCase())
  );

  // Функция для случайного изменения цены
  const getRandomChange = (price) => {
    const changePercent = (Math.random() - 0.5) * 2; // случайное изменение от -1% до +1%
    return price * (1 + changePercent / 100);
  };

  // Обновление цен каждую секунду
  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const updatedData = { ...prevData };
        const updatedTabData = updatedData[activeTab].map((item) => {
          const updatedPrice = getRandomChange(item.price);
          const updatedChange = ((updatedPrice - item.price) / item.price) * 100; // Пересчитываем изменение
          return { ...item, price: updatedPrice.toFixed(2), change: updatedChange.toFixed(2) };
        });
        updatedData[activeTab] = updatedTabData;
        return updatedData;
      });
    }, 5000); // обновление каждые 5 секунд

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [activeTab]);
    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 1000);
        return () => clearTimeout(timer);
      }, []);

    if (pageLoading) {
    return (
        <LoadingSpinner  />
    );
  }
  return (
    <div className="app">
      {/* ===== SEARCH BAR ===== */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search pair (e.g. BTC)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== TABS ===== */}
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* ===== QUOTES TABLE ===== */}
      <div className="quotes-box">
        <div className="quotes-header">
          <div>Pair</div>
          <div style={{paddingLeft:'14%'}}>Price</div>
          <div>24h change</div>
        </div>

        <div className="quotes-list">
          {filteredData.length > 0 ? (
            filteredData.map((row) => (
              <div className="quotes-row" key={row.pair}>
                <div>{row?.pair}</div>
                <div>${row?.price}</div>
                <div className={row.change >= 0 ? "green" : "red"}>
                  {row.change > 0 ? "+" : ""}
                  {row.change}%
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      </div>
      {/* ===== BOTTOM NAVIGATION ===== */}
      <UserBottomNavigation user={user}/>
    </div>
  );
}
