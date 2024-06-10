import React, { useState, useEffect } from 'react';
import './App.css';
import MonthButton from './Components/MonthButton/MonthButton';
import DayList from './Components/TableHeader/TableHeader';
import CreateRowButton from './Components/CreateRowButton/CreateRowButton';

function App() {
  const months = [
    { name: 'Jan', days: 31 },
    { name: 'Feb', days: 29 },
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

  const [selectedMonth, setSelectedMonth] = useState(months[5]);

  // set June as default month in table 
  useEffect(() => {
    setSelectedMonth(months[5]);
  }, []);


  // output table with mount amount of days
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Habit Tracker Soft
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
            <DayList days={selectedMonth.days} />
          </div>
        )}
      </div>




    </div>
  );
}

export default App;
