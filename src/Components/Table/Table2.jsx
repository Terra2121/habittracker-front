import React, { useState, useEffect, useMemo } from 'react';
import './Table.css';
import CreateRowButton from "../CreateRowButton/CreateRowButton";
import SaveDataButton from "../SaveDataButton/SaveDataButton";


const Table = ({ selectedMonth }) => {
    const monthMap = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, 
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };
  
    const daysArray = Array.from({ length: selectedMonth.days }, (_, i) => i + 1);
  
    const [habitsByMonth, setHabitsByMonth] = useState({});
    const [newHabits, setNewHabits] = useState([]);
    const [executedDays, setExecutedDays] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);

    // Функція для отримання звичок з сервера
const fetchHabits = () => {
    fetch('http://localhost:8080/api/habits/getAll')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const validHabits = data.map((habit) => ({
            ...habit,
            name: String(habit.name),
            executedDays: []
          }));
  
          // Assuming executed days are already fetched and stored in executedDays state
          // Map executed days to corresponding habits
          executedDays.forEach((executedDay) => {
            const habitIndex = validHabits.findIndex((habit) => habit.habit_id === executedDay.habit_id);
            if (habitIndex !== -1) {
              validHabits[habitIndex].executedDays.push(executedDay.executed_day);
            }
          });
  
          setHabitsByMonth((prevHabits) => ({
            ...prevHabits,
            [selectedMonth.name]: validHabits
          }));
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching habits:', error));
  };
  
  // Функція для отримання виконаних днів з сервера
  const fetchExecutedDays = () => {
    fetch('http://localhost:8080/api/executedDays/getAll')
      .then((response) => response.json())
      .then((data) => {
        setExecutedDays(data); // Зберігаємо виконані дні у стані компонента
        fetchHabits(); // Після успішного завершення fetchExecutedDays, викликаємо fetchHabits
      })
      .catch((error) => console.error('Error fetching executed days:', error));
  };







    return (
        <div className="table-wrapper">
          <table className="main-table">
            <thead>
              <tr>
                <th>Habit</th>
                {daysArray.map((day) => (
                  <th key={day}>{day}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(habitsByMonth[selectedMonth.name] || []).map((habit, rowIndex) => (
                <tr key={`habit-row-${rowIndex}`}>
                  <td>{habit.name}</td>
                  {daysArray.map((day, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="checkbox"
                        checked={checkboxes[rowIndex] && checkboxes[rowIndex][dayIndex]}
                        onChange={() => handleCheckboxChange(habit.habit_id, rowIndex, dayIndex)}
                      />
                    </td>
                  ))}
                  <td>{getTotal(habit.habit_id)}</td>
                </tr>
              ))}
              {newHabits.map((newHabit, rowIndex) => (
                <tr key={`new-habit-row-${rowIndex}`}>
                  <td>
                    <input
                      type="text"
                      value={newHabit}
                      onChange={(event) => handleInputChange(rowIndex + habitsByMonth[selectedMonth.name].length, event)}
                    />
                  </td>
                  {daysArray.map((day, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="checkbox"
                        checked={checkboxes[rowIndex + habitsByMonth[selectedMonth.name].length] && checkboxes[rowIndex + habitsByMonth[selectedMonth.name].length][dayIndex]}
                        onChange={() => handleCheckboxChange(null, rowIndex + habitsByMonth[selectedMonth.name].length, dayIndex)}
                      />
                    </td>
                  ))}
                  <td>0</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <CreateRowButton onClick={handleCreateRowClick} />
          </div>
          <div>
            <SaveDataButton onClick={handleSaveClick} />
          </div>
        </div>
      );
    };
    
    export default Table;