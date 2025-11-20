import React from 'react';
import './loadingSpinner.css';

const LoadingSpinner = ({ size = 90, color = '#4f46e5', text = 'Loading...' }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    borderColor: `${color} transparent ${color} transparent`,
  };

  return (
    <div className="loading-container">
      <div className="spinner" style={spinnerStyle}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
