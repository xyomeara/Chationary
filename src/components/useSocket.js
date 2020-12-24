import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// let socket;
// why do I have to initialize socket here first??????
const endpoint = 'localhost:8080';

const useSocket = (name, room) => {
  const [messages, setMessages] = useState([]);
  const [typeMsg, setTypeMsg] = useState(``);
  const [users, setUsers] = useState([]);
  const socketRef = useRef('');

  console.log(
    'socketRef.current before initialize socket => ',
    socketRef.current
  );

  useEffect(() => {
    console.log('useEffect fired!');

    // Creates a WebSocket connection
    socketRef.current = io(endpoint, {
      query: { name, room },
    });

    console.log(
      'socketRef.current after initialize socket => ',
      socketRef.current
    );

    // Listens for incoming messages
    socketRef.current.on('message', (message) => {
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
      // why can't we use setMessages([...messages, message])????????????
    });

    socketRef.current.on('roomData', ({ users }) => {
      setUsers(users);
    });

    socketRef.current.on('sendTypingMsg', (data) => {
      // console.log(message);
      setTypeMsg(data);
      setTimeout(() => {
        setTypeMsg('');
      }, 1000);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.close();
    };
    // should we can name out??????
  }, [name, room]);

  // client sends a message to the server
  // Server forwards it to all users in the same room
  const sendNewMessage = (newMessage) => {
    if (newMessage) {
      socketRef.current.emit('sendNewMessage', {
        id: socketRef.current.id,
        broadcaster: name,
        name,
        room,
        text: newMessage,
      });
    }
  };

  const sendTypingMsg = () => {
    socketRef.current.emit('sendTypingMsg', `${name} is typing...`);
  };

  return [messages, typeMsg, users, sendNewMessage, sendTypingMsg];
};

export default useSocket;
