import React, { useState } from 'react';
import './App.css';
import MonthButton from './Components/MonthButton';

function App() {
  const months = [
    { name: 'Jan', days: 31 },
    { name: 'Feb', days: 29 }, // можна додати обробку для високосного року
    { name: 'Mar', days: 31 },
    { name: 'Apr', days: 30 },
    { name: 'May', days: 31 },
    { name: 'Jun', days: 30 },
    { name: 'Jul', days: 31 },
    { name: 'Aug', days: 31 },
    { name: 'Sep', days: 30 },
    { name: 'Oct', days: 31 },
    { name: 'Nov', days: 30 },
    { name: 'Dec', days: 31 },
  ];

  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const renderDays = (days) => {
    let daysArray = [];
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }
    return daysArray.map(day => <span key={day}>{day} </span>);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello, World!!!!
        </p>
      </header>
      <div>
        {months.map((month) => (
          <MonthButton
            key={month.name}
            month={month.name}
            onClick={() => handleMonthClick(month)}
          />
        ))}
      </div>
      <div>
        {selectedMonth && (
          <div>
            <h2>{selectedMonth.name}</h2>
            <p>{renderDays(selectedMonth.days)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;