import React from 'react';

const Message = ({ message, name }) => {

  return message.emitter === name ? (
    <div className="message flexstart">
      <p className="sentTextUser">{message.emitter}</p>
      <div className="textBox">
        <p className="text pr">{message.text}</p>
      </div>
    </div>
  ) : (
    <div className="message flexend">
      <div className="textBox lt">
        <p className="text dk">{message.text}</p>
      </div>
      <p className="sentTextUser pl">{message.emitter}</p>
    </div>
  );
};

export default Message;
