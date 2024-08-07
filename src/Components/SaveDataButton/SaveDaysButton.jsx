import React from "react";
import './SaveDataButton.css';

const SaveDaysButton = ({ onClick}) =>{

    return (
        <button className="save-data-btn" onClick={() => onClick()}>Save days </button>
      );

}

export default SaveDaysButton;