import React from 'react';
import useInputState from './useInputState';

const InputBox = ({ sendNewMessage, setTypingMsg }) => {
  //added customized hook
  const [newMessage, handleNewMessage, reset] = useInputState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    } else {
      setTypingMsg();
    }
  };

  const handleSendMessage = (e) => {
    console.log('handleSendMessage!');
    e.preventDefault();
    sendNewMessage(newMessage);
    //calling reset in the customized hook to set input to ''
    reset();
  };

  return (
    <div className="form">
      <input
        className="inputBox"
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={handleNewMessage}
        onKeyPress={handleKeyPress}
      />
      <button className="sendButton" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default InputBox;
