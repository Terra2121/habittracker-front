import React, { useState } from 'react';
import './HabitTable.css';

const HabitTable = ({ rows }) => {

  const [habits, setHabits] = useState(Array(rows).fill(''));

  const handleInputChange = (index, value) => {
    const newHabits = [...habits];
    newHabits[index] = value;
    setHabits(newHabits);
  };

  return (
    <table className="habit-table">
      <thead>
        <tr>
          Habit
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={`habit-row-${rowIndex}`}>
            <td>
              <input
                type="text"
                value={habits[rowIndex]}
                onChange={(e) => handleInputChange(rowIndex, e.target.value)}
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
