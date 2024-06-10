import React, { useState, useEffect } from 'react';
import './App.css';
import MonthButton from './Components/MonthButton/MonthButton';
import DayList from './Components/TableHeader/TableHeader';
import CreateRowButton from './Components/CreateRowButton/CreateRowButton';
import HabitTable from './Components/HabitTable/HabitTable';
import TotalTable from './Components/TotalTable/TotalTable';
import MonthTable from './Components/MonthTable/MonthTable';

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

  const [rows, setRows] = useState(3);
  const [activeButton, setActiveButton] = useState(months[5].name);

  // set June as default month in table
  const [selectedMonth, setSelectedMonth] = useState(months[5]);
  useEffect(() => {
    setSelectedMonth(months[5]);
  }, []);

  // output table with mount amount of days
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setActiveButton(month.name);
  };

  const handleCreateRowClick = () => {
    setRows(prevRows => prevRows + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Habit Tracker Soft
        </p>
      </header>
          <div className="month-header">
            {months.map((month) => (
              <MonthButton
                key={month.name}
                month={month.name}
                isActive={activeButton === month.name}
                onClick={() => handleMonthClick(month)}
              />
            ))}
          </div>

      <div className="tables-container">

        <div className="table-wrapper">
          <HabitTable rows={rows}/>
        </div>

        <div className="table-wrapper">
          {selectedMonth && (
            // <div>
            //   <DayList days={selectedMonth.days} rows={rows} />
            // </div>
            <div>
              <MonthTable days={selectedMonth.days} rows={rows}/>

            </div>
          )}
        </div>

        <div className="table-wrapper">
          <TotalTable rows={rows}/>
        </div>

      </div>

      <div>
        <CreateRowButton onClick={handleCreateRowClick} />
      </div>




    </div>
  );
}

export default App;
