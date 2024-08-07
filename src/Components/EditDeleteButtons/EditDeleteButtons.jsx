import React, { useState } from 'react';
import './EditDeleteButtons.css'

function EditDeleteButtons({onEdit, onDelete, habitID}){

    return(
        <div>
            
            {/* <button className="edit-btn" onClick={()=>onEdit(habitID)}>
                <img src="edit-img.png" alt="edit-img"></img>
            </button> */}

            <button className="delete-btn" onClick={()=>onDelete(habitID)}>
                <img src="delete-img.png" alt="delete-img"></img>
            </button>
        </div>
    );
}

export default EditDeleteButtons;