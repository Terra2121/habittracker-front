import React from 'react';
import './TotalTable.css';

const TotalTable = ({ rows }) => {

  return (
    <table className="total-table">
      <thead>
        <tr>
          Total
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={`total-row-${rowIndex}`}>
            <td>{rowIndex + 1}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TotalTable;