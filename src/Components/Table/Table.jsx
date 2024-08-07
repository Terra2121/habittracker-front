import React, { useState, useEffect } from "react";
import "./Table.css";
import CreateRowButton from "../CreateRowButton/CreateRowButton";
import SaveHabitsButton from "../SaveDataButton/SaveHabitsButton";
import SaveDaysButton from "../SaveDataButton/SaveDaysButton";
import EditDeleteButtons from "../EditDeleteButtons/EditDeleteButtons";

const Table = ({ selectedMonth, userId, setUserId }) => {
  const monthMap = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const daysArray = Array.from({ length: selectedMonth.days }, (_, i) => i + 1);

  const [newHabits, setNewHabits] = useState([]);
  const [executedDays, setExecutedDays] = useState([]);
  const [executedDaysIds, setExecutedDaysIds] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [habits, setHabits] = useState([]);
  const [newDays, setNewDays] = useState([]);
  const [deletedDays, setDeletedDays] = useState([]);

  // read data
  useEffect(() => {
    const fetchUserAndHabits = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get("user_id");

        if (userId) {
          localStorage.setItem("user_id", userId);
        } else {
          userId = localStorage.getItem("user_id");
        }

        if (!userId) {
          window.location.href = "http://localhost:8080/api/auth/success";
          return;
        }

        setUserId(userId);

        const executedDaysResponse = await fetch(
          "http://localhost:8080/api/executedDays/getAll",
          {
            method: "GET",
            credentials: "include",
            redirect: "follow",
          }
        );

        if (executedDaysResponse.redirected) {
          window.location.href = executedDaysResponse.url;
          return;
        }

        const executedDaysData = await executedDaysResponse.json();
        setExecutedDays(executedDaysData);

        const habitsResponse = await fetch(
          `http://localhost:8080/api/habits/getByUserId?user_id=${userId}`,
          {
            method: "GET",
            credentials: "include",
            redirect: "follow",
          }
        );

        if (habitsResponse.redirected) {
          window.location.href = habitsResponse.url;
          return;
        }

        const habitsData = await habitsResponse.json();
        if (!Array.isArray(habitsData)) {
          console.error("Invalid data format:", habitsData);
          return;
        }

        const combinedData = habitsData.map((habit) => ({
          ...habit,
          executedDays: executedDaysData
            .filter((day) => day.habit_id === habit.habit_id)
            .map((day) => day.executed_day),
          executedDaysIds: executedDaysData
          .filter((day) => day.habit_id === habit.habit_id)
          .map((day) => day.executed_day_id),
        })
      );

        setHabits(combinedData);
        console.log(combinedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndHabits();
  }, []);

  // create habits
  const saveHabits = (validHabits) => {
    const promises = validHabits.map(({ name, userId }) => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, user_id: userId }),
        credentials: "include",
        mode: "cors",
      };

      return fetch(
        "http://localhost:8080/api/habits/createHabit",
        requestOptions
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      });
    });

    Promise.all(promises)
      .then((data) => {
        setHabits((prevHabits) => [...prevHabits, ...data]);
        setNewHabits([]);
      })
      .catch((error) => console.error("Error creating habits:", error));
  };

  // save habit button
  const handleSaveHabitsClick = () => {
    const validHabits = [];

    newHabits.forEach((newHabit, index) => {
      const newName = newHabit.name.trim();
      if (!newName) {
        console.error(`Habit name at index ${index} cannot be empty`);
        return;
      }
      validHabits.push({ name: newName, userId });
    });

    if (validHabits.length > 0) {
      saveHabits(validHabits);
    }
  };

  // CHECKBOXES
  // checkboxes
  useEffect(() => {
    if (habits.length > 0) {
      const initialCheckboxes = habits.map((habit) =>
        daysArray.map((day) => isExecuted(habit.habit_id, day))
      );
      setCheckboxes(initialCheckboxes);
    }
  }, [habits, selectedMonth]);

  // mark executed days from DB
  const isExecuted = (habitId, day) => {
    const tableMonthIndex = monthMap[selectedMonth.name];
    const habit = habits.find((habit) => habit.habit_id === habitId);

    if (!habit || !Array.isArray(habit.executedDays)) return false;

    return habit.executedDays.some((executedDay) => {
      const [executedYear, executedMonth, executedDayOfMonth] = executedDay
        .split("-")
        .map(Number);
      return (
        tableMonthIndex === executedMonth - 1 && executedDayOfMonth === day
      );
    });
  };

  const handleCheckboxChange = (habitId, dayIndex) => {
    setCheckboxes((prevCheckboxes) => {
      const rowIndex = habits.findIndex((habit) => habit.habit_id === habitId);
      if (rowIndex === -1) return prevCheckboxes;
  
      const updatedCheckboxes = [...prevCheckboxes];
      const newCheckedState = !updatedCheckboxes[rowIndex][dayIndex];
      updatedCheckboxes[rowIndex] = [...updatedCheckboxes[rowIndex]];
      updatedCheckboxes[rowIndex][dayIndex] = newCheckedState;
  
      const day = daysArray[dayIndex];
      const month = monthMap[selectedMonth.name] + 1;
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;
      const executedDay = `2024-${formattedMonth}-${formattedDay}`;
  
      const executedDaysToUpdate = newCheckedState
        ? [...executedDays, { habit_id: habitId, executed_day: executedDay }]
        : executedDays.filter(
            (executedDay) =>
              !(
                executedDay.habit_id === habitId &&
                executedDay.executed_day === executedDay
              )
          );
  
      setExecutedDays(executedDaysToUpdate);
  
      const newDaysToUpdate = newCheckedState
        ? [...newDays, { habit_id: habitId, executed_day: executedDay }]
        : newDays.filter(
            (newDay) =>
              !(
                newDay.habit_id === habitId &&
                newDay.executed_day === executedDay
              )
          );
  
      setNewDays(newDaysToUpdate);
  
      const deletedDaysToUpdate = !newCheckedState
      ? [
          ...deletedDays,
          { 
            habit_id: habitId, 
            executed_day: executedDay, 
            executed_day_id: getDayId(habitId, executedDay)
          },
        ]
      : deletedDays.filter(
          (deletedDay) =>
            !(
              deletedDay.habit_id === habitId &&
              deletedDay.executed_day === executedDay
            )
        );

    setDeletedDays(deletedDaysToUpdate);
  
      return updatedCheckboxes;
    });
  };
  

  const handleSaveDaysClick = async () => {
    const uniqueDaysSet = new Set();
  
    const uniqueDaysToSave = newDays.filter((day) => {
      const uniqueKey = `${day.habit_id}-${day.executed_day}`;
      if (uniqueDaysSet.has(uniqueKey)) {
        return false;
      } else {
        uniqueDaysSet.add(uniqueKey);
        return true;
      }
    });
  
    const uniqueDaysToDelete = deletedDays.filter((day) => {
      const uniqueKey = `${day.habit_id}-${day.executed_day}`;
      if (uniqueDaysSet.has(uniqueKey)) {
        return false;
      } else {
        uniqueDaysSet.add(uniqueKey);
        return true;
      }
    });
  
    if (uniqueDaysToSave.length > 0) {
      for (const day of uniqueDaysToSave) {
        console.log("Saving day:", day.executed_day, " : ", day.habit_id);
        await saveExecutedDay(day.executed_day, day.habit_id);
      }
      setNewDays([]);
    }
  
    if (uniqueDaysToDelete.length > 0) {
      for (const day of uniqueDaysToDelete) {
        console.log("Deleting day:", day.executed_day_id);
        await deleteExecutedDay(day.executed_day_id);
      }
      setDeletedDays([]);
    }
  };
  

  // DAYS
  const getDayId = (habitId, executedDay) => {
    const day = executedDays.find(
      (day) => day.habit_id === habitId && day.executed_day === executedDay
    );
    return day ? day.executed_day_id : undefined;
  };
  
  //
  const deleteExecutedDay = async (dayId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/executedDays/deleteDay/${dayId}`,
        {
          method: "DELETE",
          credentials: "include",
          mode: "cors",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const responseText = await response.text();
      if (responseText) {
        return JSON.parse(responseText);
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error deleting day:", error);
      throw error;
    }
  };
  
  // create days
  const saveExecutedDay = async (executedDay, habitId) => {
    try {
      const [year, month, day] = executedDay.split("-");
      const formattedDate = formatDate(
        parseInt(year),
        parseInt(month),
        parseInt(day)
      );

      const response = await fetch(
        "http://localhost:8080/api/executedDays/createDay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            executed_day: formattedDate,
            habit_id: habitId,
            mode: "cors",
          }),
        }
      );

      console.log(formattedDate, " : ", habitId);

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = JSON.parse(textResponse);
      console.log("Successfully saved executed day:", data);
    } catch (error) {
      console.error("Error saving executed day:", error);
    }
  };

  const formatDate = (year, month, day) => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // total
  const getTotal = (habitId) => {
    const selectedMonthIndex = monthMap[selectedMonth.name];
    const total = executedDays.filter((executedDay) => {
      const [executedYear, executedMonth, executedDayOfMonth] =
        executedDay.executed_day.split("-").map(Number);
      return (
        executedDay.habit_id === habitId &&
        executedMonth - 1 === selectedMonthIndex
      );
    }).length;

    return total;
  };

  // create new row
  const handleCreateRowClick = () => {
    setNewHabits((prevNewHabits) => [
      ...prevNewHabits,
      { name: "", executedDays: [] },
    ]);
  };

  // input new habit
  const handleNewHabitNameChange = (index, event) => {
    const updatedHabits = [...newHabits];
    updatedHabits[index].name = event.target.value;
    setNewHabits(updatedHabits);
  };

  // delete habit
  const handleDeleteHabit = async (habitId) => {
    const confirmed = window.confirm('Do you really want to delete this habit?');
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/habits/deleteHabit/${habitId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.habit_id !== habitId)
      );
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <div className="table-wrapper">
      <table className="main-table">
        <thead>
          <tr>
            <th className="habit-column">Habit</th>
            {daysArray.map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th>Total</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, rowIndex) => (
            <tr key={`habit-row-${rowIndex}`}>
              <td className="habit-row">{habit.name}</td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="checkbox"
                    checked={
                      checkboxes[rowIndex]
                        ? checkboxes[rowIndex][dayIndex]
                        : false
                    }
                    onChange={() =>
                      handleCheckboxChange(habit.habit_id, dayIndex)
                    }
                  />
                </td>
              ))}
              <td>{getTotal(habit.habit_id)}</td>
              <td>
                <EditDeleteButtons
                  habitID={habit.habit_id}
                  onDelete={handleDeleteHabit}
                />
              </td>
            </tr>
          ))}
          {newHabits.map((newHabit, rowIndex) => (
            <tr key={`new-habit-row-${rowIndex}`}>
              <td>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(event) =>
                    handleNewHabitNameChange(rowIndex, event)
                  }
                />
              </td>
              {daysArray.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <input type="checkbox" disabled />
                </td>
              ))}
              <td>0</td>
              <td>
                <EditDeleteButtons
                  habitID={newHabit.id}
                  onDelete={handleDeleteHabit}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <CreateRowButton onClick={handleCreateRowClick} />
      </div>
      <div>
        <SaveHabitsButton onClick={handleSaveHabitsClick} />
      </div>
      <div>
        <SaveDaysButton onClick={handleSaveDaysClick} />
      </div>
    </div>
  );
};

export default Table;