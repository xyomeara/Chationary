import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;
const endpoint = 'localhost:8080';

const useSocket = (name, room) => {
  const [messages, setMessages] = useState([]);
  const [typeMsg, setTypeMsg] = useState(``);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log('useEffect fired!');

    // Creates a WebSocket connection
    socket = io(endpoint, {
      query: { name, room },
    });

    // Listens for incoming messages
    socket.on('message', (message) => {
      // setTypeMsg('');
      console.log(message);
      // if (
      //   message.broadcaster === 'Admin' &&
      //   (message.text.includes('welcome to') ||
      //     message.text.includes('has joined!'))
      // ) {
      //   console.log('newUser join!!!!!!!!!');
      //   const newUser = { ...message };
      //   delete newUser.text;
      //   setUsers((users) => [...users, newUser]);
      // }
      setMessages((messages) => [...messages, message]);
      // why can't we use setMessages([...messages, message])???
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    socket.on('sendTypingMsg', (data) => {
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
        broadcaster: name,
        name,
        room,
        text: newMessage,
      });
    }
  };

  const sendTypingMsg = () => {
    socket.emit('sendTypingMsg', `${name} is typing...`);
  };

  return [messages, typeMsg, users, sendNewMessage, sendTypingMsg];
};

export default useSocket;
