import React from 'react';
import { Link } from 'react-router-dom';
import { Chatrooms } from './Chatrooms';

export default function NavDropdown() {
  const rooms = Chatrooms.map((room, idx) => {
    return (
      <div className="NavDropdown" key={`room-${idx}`}>
        <Link to={room.link} style={{ textDecoration: 'none' }}>
          {room.roomName}
        </Link>
      </div>
    );
  });
  return <>{rooms}</>;
}
