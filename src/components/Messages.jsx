import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';

const Messages = ({ messages, name, typeMsg }) => {
  console.log('type-->', typeMsg);

  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => (
        <div key={`message-${i}`}>
          <Message message={message} name={name} />
        </div>
      ))}
      <p>{typeMsg}</p>
    </ScrollToBottom>
  );
};

export default Messages;
