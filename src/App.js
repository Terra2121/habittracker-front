import React, { useState } from "react";
import "./App.css";
import MonthButton from "./Components/MonthButton/MonthButton";
import Table from "./Components/Table/Table";

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

  const [selectedMonth, setSelectedMonth] = useState(months[5]); // set June as default month in table

  // output table with selected month
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Habit Tracker Soft</p>
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
        <Table selectedMonth={selectedMonth} />
      </div>
       
    </div>
  );
}

export default App;
