import React from 'react';
import './MonthButton.css';

const MonthButton = ({ month, onClick}) => {
  return (
    <button className="month-button" onClick={() => onClick(month)}>
      {month}
    </button>
  );
};

export default MonthButton;