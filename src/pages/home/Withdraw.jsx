import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import { useAuth } from "../../context/AuthContext";
import "./rechargePage.css";

const currencies = [
  {
    name: "USDT",
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
  },
  {
    name: "ETH",
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  {
    name: "USDC",
    img: "https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png",
  },
];

export default function Withdraw() {
  const {user} = useAuth();
  const [search, setSearch] = useState("");

  return (
    <div className="page">
      {/* HEADER — только input */}
      <div className="recharge-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <main className="content">
        <h3 className="content_title">Select the currency you want to recharge</h3>

        <div className="currencies">
          {currencies
            .filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((currency) => (
              <NavLink
                key={currency.name}
                to={`/assets/withdraw/${currency.name.toLowerCase()}`}
                className="currency-item"
              >
                <div className="currency-info">
                  <img src={currency.img} alt={currency.name} />
                  <span>{currency.name}</span>
                </div>
              </NavLink>
            ))}
        </div>
      </main>
      <UserBottomNavigation user={user}/>
    </div>
  );
}
