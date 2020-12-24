import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;
const endpoint = 'localhost:8080';

const useSocket = (name, room) => {
  const [messages, setMessages] = useState([]);
  const [typeMsg, setTypeMsg] = useState(``);

  useEffect(() => {
    console.log('useEffect fired!');

    // Creates a WebSocket connection
    socket = io(endpoint, {
      query: { name, room },
    });

    // Listens for incoming messages
    socket.on('message', (message) => {
      // setTypeMsg('');
      // console.log(message);
      setMessages((messages) => [...messages, message]);
    });
    // console.log('receiving message from the backend socket');

    socket.on('typingMsg', (data) => {
      // console.log(message);
      setTypeMsg(data);
      setTimeout(() => {
        setTypeMsg('');
      }, 1000);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socket.close();
    };
  }, [name, room]);

  // client sends a message to the server
  // Server forwards it to all users in the same room
  const sendNewMessage = (newMessage) => {
    if (newMessage) {
      socket.emit('sendNewMessage', {
        id: socket.id,
        name,
        room,
        text: newMessage,
      });
    }
  };

  const sendTypingMsg = () => {
    socket.emit('typing', `${name} is typing...`);
  };

  return [messages, typeMsg, sendNewMessage, sendTypingMsg];
};

export default useSocket;
