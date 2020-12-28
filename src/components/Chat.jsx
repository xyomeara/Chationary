import React from 'react';
import Messages from './Messages';
import InfoBar from './InfoBar';
import InputBox from './InputBox';
import UsersDisplay from './UsersDisplay';
import useSocket from './useSocket';

const Chat = ({ match }) => {
  const { name, room } = match.params;
  // console.log(match.params);
  const [messages, typeMsg, users, sendNewMessage, sendTypingMsg] = useSocket(
    name,
    room
  );

  console.log('messages in Chat Component => ', messages);
  // console.log('users in Chat Component => ', users);

  return (
    <div className="chatOuterContainer">
      <div className="chatInnerContainer">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} typeMsg={typeMsg} />
        <InputBox
          sendNewMessage={sendNewMessage}
          sendTypingMsg={sendTypingMsg}
        />
      </div>
      <UsersDisplay users={users} />
    </div>
  );
};
export default Chat;
