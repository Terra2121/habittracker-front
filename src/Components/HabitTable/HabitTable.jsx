import React, { useState } from 'react';
import './HabitTable.css';

const HabitTable = ({ rows, habits, setHabits }) => {

  //const [habits, setHabits] = useState(Array(rows).fill(''));

  // input habits in fields and save them
  // const handleInputChange = (index, name) => {
  //   const newHabits = [...habits];
  //   newHabits[index] = name;
  //   setHabits(newHabits);
  // };
    

  // save habit in db when Enter is pressed
  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter') {
      saveHabit(index);
    }
  };

  // save habit 
  const saveHabit = (index) => {
    const newName = habits[index];
    console.log(`Saving habit : ${newName}`);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName}),
      mode: "cors"
    };

      fetch(`http://localhost:8080/api/executedDays/createDay`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHabits([...habits, data]);
                console.log('Habit created successfully:', data);
            })
            .catch(error => {
                console.error('Error creating habit:', error);
            });
  };


  return (
    <table className="habit-table">
      <thead>
        <tr>
          <th>Habit</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={`habit-row-${rowIndex}`}>
            <td>
              <input
                type="text"
                value={habits[rowIndex]}
                //onChange={(e) => handleInputChange(rowIndex, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, rowIndex)}
                placeholder={`Habit ${rowIndex + 1}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HabitTable;
