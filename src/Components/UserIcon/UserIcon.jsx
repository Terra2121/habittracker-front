import React from 'react';

function UserIcon() {
  const userName = 'Admin';
  return (
    <div className="user-container">
      <img src="user_icon.png" alt="user-img" className="user-img" />
      <span className="user-name">{userName}</span>
    </div>
  );
}

export default UserIcon;