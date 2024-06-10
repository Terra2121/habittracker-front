import React from 'react';
import './MonthButton.css';

const MonthButton = ({ month, isActive, onClick}) => {
  return (
    <button
      className={`month-button ${isActive ? 'active' : ''}`}
      onClick={onClick}>
      {month}
    </button>
  );
};

export default MonthButton;