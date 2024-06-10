import React, { useState } from 'react';
import DayTable from '../MonthTable/MonthTable';
import CreateRowButton from '../CreateRowButton/CreateRowButton';

const DayList = ({ days }) => {

  const [rows, setRows] = useState(3);

  let daysArray = [];
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  return (
    <div>
      <table>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {daysArray.map(day => (
                <td key={`row-${rowIndex}-day-${day}`}> {rowIndex + 1}, {day}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <CreateRowButton onClick={() => setRows(prevRows => prevRows + 1)} />
      </div>
    </div>
  );
};

export default DayList;

