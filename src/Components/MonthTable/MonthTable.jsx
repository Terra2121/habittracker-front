import React from 'react';
import './MonthTable.css';

const MonthTable = ({ days, rows }) => {


  let daysArray = [];
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  return (
    <table className="month-table">
      <thead>
        <tr>
          {daysArray.map(day => (
            <th key={`header-${day}`}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {daysArray.map(day => (
              <td key={`row${rowIndex + 1}-${day}`}>
                <input type="checkbox" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthTable;
