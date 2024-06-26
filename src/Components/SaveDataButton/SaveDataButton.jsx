import React from "react";
import './SaveDataButton.css';

const SaveDataButton = ({ onClick}) =>{

    return (
        <button className="save-data-btn" onClick={() => onClick()}>Save data </button>
      );

}

export default SaveDataButton;