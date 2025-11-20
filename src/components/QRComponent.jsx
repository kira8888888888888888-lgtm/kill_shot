import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";  // Մտնում է QRCodeCanvas

const QRComponent = () => {
  const [address, setAddress] = useState("TAzNAt6YqihijXsLXJfoMy2JWVhzWJooWo"); // TRC20 Address
  const [amount, setAmount] = useState(""); // Amount

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Amount to send: ${amount} USDT`);
  };

  return (
    <div>
      <h3>Deposit USDT (TRC20) via QR Code</h3>

      {/* QR Code displays the address and amount */}
      <div>
        <QRCodeCanvas value={`TRC20:${address}?amount=${amount}`} size={256} />
      </div>

      {/* Form to enter amount */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)} // Update TRC20 address
          placeholder="Enter TRC20 address"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Update amount
          placeholder="Enter amount"
        />
        <button type="submit">Generate QR</button>
      </form>
    </div>
  );
};

export default QRComponent;
