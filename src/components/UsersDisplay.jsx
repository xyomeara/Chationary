import React from 'react';

const UsersDisplay = ({ users }) => {
  console.log('users in UserDisplay Component => ', users);
  return (
    <div className="userDisplay">
      <div>
        <h3>People currently chatting:</h3>
        <div className="activeUsers">
          <h4>
            {users.map(({ name }, i) => (
              <div key={`name-${i}`} className="activeItem">
                <img alt="Online Icon" src="/assets/images/onlineIcon.png" />
                {name}
              </div>
            ))}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default UsersDisplay;
