import React from "react";
import './SaveDataButton.css';

const SaveHabitsButton = ({ onClick}) =>{

    return (
        <button className="save-data-btn" onClick={() => onClick()}>Save habits </button>
      );

}

export default SaveHabitsButton;