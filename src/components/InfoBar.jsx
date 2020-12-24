import React from 'react';

const InfoBar = ({ room }) => {
  return (
    <div className="infoBar">
      <h3>{`${room} Chatroom`}</h3>
    </div>
  );
};

export default InfoBar;
