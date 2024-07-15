import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import './Table.css';
import CreateRowButton from "../CreateRowButton/CreateRowButton";
import SaveDataButton from "../SaveDataButton/SaveDataButton";

const userContext = createContext(null);

const Table = ({ selectedMonth }) => {
  const monthMap = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, 
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };

  const daysArray = Array.from({ length: selectedMonth.days }, (_, i) => i + 1);

  const [newHabits, setNewHabits] = useState([]);
  const [executedDays, setExecutedDays] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(userContext);

  useEffect(() => {
    if (habits.length > 0) {
      console.log(habits);
      
    }
  }, [habits]);

  useEffect(() => {
    const fetchUserAndHabits = async () => {
      try {
        const userIdResponse = await fetch('http://localhost:8080/api/auth/success', {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow'
        });
  
        if (userIdResponse.redirected) {
          window.location.href = userIdResponse.url;
          return;
        }
  
        const userId = await userIdResponse.text();
  
        const executedDaysResponse = await fetch('http://localhost:8080/api/executedDays/getAll', {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow'
        });
  
        if (executedDaysResponse.redirected) {
          window.location.href = executedDaysResponse.url;
          return;
        }
  
        const executedDaysData = await executedDaysResponse.json();
  
        const habitsResponse = await fetch(`http://localhost:8080/api/habits/getByUserId?user_id=${userId}`, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow'
        });
  
        if (habitsResponse.redirected) {
          window.location.href = habitsResponse.url;
          return;
        }
  
        const habitsData = await habitsResponse.json();
        if (!Array.isArray(habitsData)) {
          console.error('Invalid data format:', habitsData);
          return;
        }
  
        const combinedData = habitsData.map(habit => ({
          ...habit,
          executedDays: executedDaysData.filter(day => day.habit_id === habit.habit_id).map(day => day.executed_day)
        }));
  
        setHabits(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchUserAndHabits();
  }, []);
  
  // до автентифікації
  const isExecuted = useMemo(() => {
    return (habitId, day) => {
      const tableMonthIndex = monthMap[selectedMonth.name];
  
      const habit = habits.find((habit) => habit.habit_id === habitId);
  
      if (!habit) return false;
  
      return habit.executedDays.some((executedDay) => {
        const [executedYear, executedMonth, executedDayOfMonth] = executedDay.split('-').map(Number);
  
        return (
          tableMonthIndex === executedMonth - 1 &&
          executedDayOfMonth === day
        );
      });
    };
  }, [habits, selectedMonth, monthMap]);
  

  // // input habit data
  // const handleInputChange = (index, event) => {
  //   const newValue = event.target.value;
  //   const updatedHabits = index < habits[selectedMonth.name].length
  //     ? habits[selectedMonth.name].map((habit, i) => (i === index ? { ...habit, name: newValue } : habit))
  //     : newHabits.map((habit, i) => (i === index - habits[selectedMonth.name].length ? newValue : habit));
    
  //   if (index < habits[selectedMonth.name].length) {
  //     setHabits((prevHabits) => ({
  //       ...prevHabits,
  //       [selectedMonth.name]: updatedHabits
  //     }));
  //   } else {
  //     setNewHabits(updatedHabits);
  //   }
  // };

  // create new habit
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
        const updatedHabits = [...habits, data];
        setHabits(updatedHabits);
        // setHabits((prevHabits) => ({
        //   ...prevHabits,
        //   [selectedMonth.name]: updatedHabits
        // }));
        //fetchHabits();

        const habitId = data.habit_id;
        const executedDaysToCreate = checkboxes[index].map((isChecked, dayIndex) => {
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

        saveExecutedDays(executedDaysToCreate);
      })
      .catch((error) => console.error('Error creating habit:', error));
  };

  // create new executed days
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
        //.then(() => fetchExecutedDays())
        .catch((error) => console.error('Error saving executed day:', error));
    });
  };

  // change checkbox state
  const handleCheckboxChange = (rowIndex, dayIndex) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[rowIndex][dayIndex] = !updatedCheckboxes[rowIndex][dayIndex];
    setCheckboxes(updatedCheckboxes);
  };

  

  // // counting total column
  // const getTotal = (habitId) => {
  //   const selectedMonthIndex = monthMap[selectedMonth.name];
  //   const habit = habits.find(habit => habit.id === habitId);
  
  //   const total = executedDays.filter(executedDay => {
  //     const [executedYear, executedMonth, executedDayOfMonth] = executedDay.executed_day.split('-').map(Number);
  //     return executedDay.habit_id === habitId && executedMonth - 1 === selectedMonthIndex;
  //   }).length;

  //   console.log(habitId)
  
  //   return total;
  // };

  // counting total column
const getTotal = (habitId) => {
  const habit = habits.find(habit => habit.id === habitId);

  if (!habit) {
    console.error(`Habit with ID ${habitId} not found.`);
    return 0;
  }

  // Get the length of executedDays array for the habit
  const total = habit.executedDays.length;

  return total;
};


  // add new row 
  const handleCreateRowClick = () => {
    setNewHabits((prevNewHabits) => [...prevNewHabits, { name: '', executedDays: [] }]);
  };

  const handleNewHabitNameChange = (index, event) => {
    const newHabitsCopy = [...newHabits];
    newHabitsCopy[index].name = event.target.value;
    setNewHabits(newHabitsCopy);
  };
  
  // save habits
  const handleSaveClick = (index) => {
    const newName = newHabits[index].name.trim();
  
    if (!newName) {
      console.error('Habit name cannot be empty');
      return;
    }
    else{
      const newHabit = {
      name: newName,
      executedDays: []
      };
      createHabit(newHabit);
    }
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
          {habits.map((habit, rowIndex) => (
            <tr key={`habit-row-${rowIndex}`}>
              <td>{habit.name}</td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="checkbox"
                    checked={isExecuted(habit.habit_id, day)}
                    onChange={() => handleCheckboxChange(rowIndex, dayIndex)}
                  />
                </td>
              ))}
              <td>{getTotal(habit.habit_id)}</td>
              {/* <td>Hi, {user.name}</td> */}
            </tr>
          ))}
          {newHabits.map((newHabit, rowIndex) => (
            <tr key={`new-habit-row-${rowIndex}`}>
              <td>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(event) => handleNewHabitNameChange(rowIndex, event)}
                  //onChange={(event) => handleInputChange(rowIndex + habits[selectedMonth.name].length, event)}
                />
              </td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="checkbox"
                    disabled
                    //checked={checkboxes[rowIndex + habits[selectedMonth.name].length] && checkboxes[rowIndex + habits[selectedMonth.name].length][dayIndex]}
                    //onChange={() => handleCheckboxChange(null, rowIndex + habits[selectedMonth.name].length, dayIndex)}
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





