import React, { useState } from "react";
import "./App.css";
import MonthButton from "./Components/MonthButton/MonthButton";
import Table from "./Components/Table/Table";
import UserIcon from './Components/UserIcon/UserIcon';

function App() {
  const months = [
    { name: "JAN", days: 31 },
    { name: "FEB", days: 29 },
    { name: "MAR", days: 31 },
    { name: "APR", days: 30 },
    { name: "MAY", days: 31 },
    { name: "JUN", days: 30 },
    { name: "JUL", days: 31 },
    { name: "AUG", days: 31 },
    { name: "SEP", days: 30 },
    { name: "OCT", days: 31 },
    { name: "NOV", days: 30 },
    { name: "DEC", days: 31 },
  ];

  const [selectedMonth, setSelectedMonth] = useState(months[7]); 
  const [userId, setUserId] = useState(null);


  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  return (
    
      <div className="app">
        <header className="app-header">
          <p className="app-title">HABIT TRACKER SOFT</p>
          <UserIcon 
            userId={userId} 
          />
        </header>
        <div>
          {months.map((month) => (
            <MonthButton
              key={month.name}
              month={month}
              isActive={selectedMonth.name === month.name}
              onClick={() => handleMonthClick(month)}
            />
          ))}
        </div>
        <div>
          <Table 
            selectedMonth={selectedMonth} 
            userId={userId} 
            setUserId={setUserId}
          />
        </div>
      </div>
  );
}

export default App;

