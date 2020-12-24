import React from 'react';

const UsersDisplay = ({ users }) => (
  <div className="userDisplay">
    {users ? (
      <div>
        <h2>People currently chatting:</h2>
        <div className="activeUsers">
          <h3>
            {users.map(({ name }, i) => (
              <div key={`name-${i}`} className="activeItem">
                {name}
              </div>
            ))}
          </h3>
        </div>
      </div>
    ) : null}
  </div>
);

export default UsersDisplay;
