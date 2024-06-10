import React from "react";
import './CreateRowButton.css';

const CreateRowButton = ({ onClick}) =>{

    return (
        <button className="create-row-btn" onClick={() => onClick()}>Add Row </button>
      );

}

export default CreateRowButton;
