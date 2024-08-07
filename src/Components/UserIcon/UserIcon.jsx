import React, { useState, useEffect } from 'react';
import "./UserIcon.css";

function UserIcon({ userId }) {
  const [userName, setUserName] = useState('');
  const [userAvatarUrl, setUserAvatarUrl] = useState('');
  const [showLogoutButton, setShowLogoutButton] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsResponse = await fetch(`http://localhost:8080/api/users/getUserById/${userId}`, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow'
        });

        if (userDetailsResponse.redirected) {
          window.location.href = userDetailsResponse.url;
          return;
        }

        const userDetails = await userDetailsResponse.json();
        setUserName(userDetails.name);
        setUserAvatarUrl(userDetails.avatar_url);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleIconClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  

  return (
    <div className="user-container">
      <button onClick={handleIconClick} className="user-icon-button">
        <img src={userAvatarUrl} alt="user-img" className="user-img" />
      </button>
      <span className="user-name">{userName}</span>
      {showLogoutButton && (
        <button onClick={handleLogout} className="logout-button">
          Log out
        </button>
      )}
    </div>
  );
}

export default UserIcon;
