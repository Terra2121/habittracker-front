import React, { useState, useEffect } from 'react';
import './Table.css';
import CreateRowButton from "../CreateRowButton/CreateRowButton";
import SaveDataButton from "../SaveDataButton/SaveDataButton";

const Table = ({ selectedMonth }) => {
  const monthMap = {  //month numeration
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, 
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };

  const [habits, setHabits] = useState([]);
  const [newHabits, setNewHabits] = useState([]);
  const [executedDays, setExecutedDays] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);

  // read data from DB when app start
  useEffect(() => {
    fetchHabits();
    fetchExecutedDays();
  }, []);

  // read habits from DB
  const fetchHabits = () => {
    fetch('http://localhost:8080/api/habits/getAll')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const validHabits = data.map((habit) =>
            typeof habit === 'object' && habit.name
              ? habit
              : { habit_id: habit.habit_id, name: String(habit.name) }
          );
          setHabits(validHabits);
          setNewHabits([]);
          console.log('Fetching habits: ', validHabits);
        } else {
          console.error('Invalid data format: ', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching habits:', error);
      });
  };

  // read executed days from DB
  const fetchExecutedDays = () => {
    fetch('http://localhost:8080/api/executedDays/getAll')
      .then((response) => response.json())
      .then((data) => {
        setExecutedDays(data);
        console.log('Fetching executed days: ', data);
      })
      .catch((error) => {
        console.error('Error fetching executed days:', error);
      });
  };

    // check in table executed days from DB
    const isExecuted = (habitId, day, monthIndex, rowIndex) => {
    return executedDays.some((executedDay) => {
      const [executedYear, executedMonth, executedDayOfMonth] = executedDay.executed_day.split('-').map(Number);
      const tableMonthIndex = monthMap[selectedMonth.name]; 

      const executedInSelectedDay = executedDay.habit_id === habitId &&
        tableMonthIndex === executedMonth -1 &&
        executedDayOfMonth === day &&
        habits[rowIndex].habit_id === habitId;

      return executedInSelectedDay;
    });
  };
  

  // save data in DB
  const handleSaveClick = () => {
    newHabits.forEach((newHabit, index) => {
      if (newHabit.trim() !== '') {
        createHabit(newHabit, index);
      }
    });
  };
  
  // create and save new habit
  const createHabit = (newName, index) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
      mode: 'cors',
    };
  
    fetch('http://localhost:8080/api/habits/createHabit', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setHabits([...habits, data]);
        console.log('Habit created successfully:', data);
        fetchHabits();
  
        const habitId = data.habit_id;
        const executedDaysToCreate = checkboxes.map((isChecked, dayIndex) => {
          if (isChecked) {
            const dayOfMonth = dayIndex + 1;
            const monthIndex = monthMap[selectedMonth.name];
            const executedDate = `2024-${(monthIndex + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`;
            return {
              habit_id: habitId,
              executed_day: executedDate,
            };
          }
          return null;
        }).filter(day => day !== null);
  
        if (executedDaysToCreate.length > 0) {
          saveExecutedDays(executedDaysToCreate);
        }
      })
      .catch((error) => {
        console.error('Error creating habit:', error);
      });
  };
  
  // create and save new executed days
  const saveExecutedDays = (executedDaysToCreate) => {
    executedDaysToCreate.forEach((executedDay) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(executedDay),
        mode: 'cors',
      };
  
      fetch('http://localhost:8080/api/executedDays/createDay', requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Executed day saved successfully:', data);
          fetchExecutedDays();
        })
        .catch((error) => {
          console.error('Error saving executed day:', error);
        });
    });
  };

  // handle input in habit field
  const handleInputChange = (index, event) => {
    const newValue = event.target.value;
    if (index < habits.length) {
      setHabits(
        habits.map((habit, i) => (i === index ? { ...habit, name: newValue } : habit))
      );
    } else {
      setNewHabits(
        newHabits.map((habit, i) =>
          i === index - habits.length ? newValue : habit
        )
      );
    }
  };


  const handleCheckboxChange = ( dayIndex) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = [...prevCheckboxes];
      updatedCheckboxes[dayIndex] = !updatedCheckboxes[dayIndex];
      return updatedCheckboxes;
    });
  };

  // create new row in table
  const handleCreateRowClick = () => {
    setNewHabits((prevNewHabits) => [...prevNewHabits, ""]);
  };

  // count executed days for habit in selected month
  const getTotal = (habitId) => {
    const selectedMonthIndex = monthMap[selectedMonth.name];
    return executedDays.filter((executedDay) => {
      const [executedYear, executedMonth, executedDayOfMonth] = executedDay.executed_day.split('-').map(Number);
      return executedDay.habit_id === habitId && executedMonth - 1 === selectedMonthIndex;
    }).length;
  };


  // array with amount of days in month
  let daysArray = [];
  for (let i = 1; i <= selectedMonth.days; i++) {
    daysArray.push(i);
  }

  return (
    <div className="table-wrapper">
      <table className="main-table">
        <thead>
          <tr>
            <th>Habit</th>
            {daysArray.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, rowIndex) => (
            <tr key={`habit-row-${rowIndex}`}>
              <td>
                <input
                  type="text"
                  value={habit.name}
                  onChange={(event) => handleInputChange(rowIndex, event)}
                />
              </td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="checkbox"
                    checked={isExecuted(habit.habit_id, day, selectedMonth.monthIndex, rowIndex)}
                    readOnly
                  />
                </td>
              ))}
              <td>{getTotal(habit.habit_id)}</td>
            </tr>
          ))}
          { newHabits.map((newHabit, rowIndex) => (
            <tr key={`new-habit-row-${rowIndex}`}>
              <td>
                <input
                  type="text"
                  value={newHabit}
                  onChange={(event) =>
                    handleInputChange(rowIndex + habits.length, event)
                  }
                />
              </td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="checkbox"
                    checked={checkboxes[dayIndex]}
                    onChange={() => handleCheckboxChange(dayIndex)}
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