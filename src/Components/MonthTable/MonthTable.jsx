import React from 'react';
import './MonthTable.css';

const MonthTable = ({ days }) => {


  let daysArray = [];
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  return (
    <table>
      <thead>
        <tr>
          {daysArray.map(day => (
            <th key={`header-${day}`}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {daysArray.map(day => (
            <td key={`row1-${day}`}>Row 1</td>
          ))}
        </tr>
        <tr>
          {daysArray.map(day => (
            <td key={`row2-${day}`}>{day}</td>
          ))}
        </tr>
        <tr>
          {daysArray.map(day => (
            <td key={`row3-${day}`}>Row 3</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default MonthTable;
