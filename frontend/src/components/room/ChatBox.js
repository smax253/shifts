import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

const ChatBox = ({chatLog, sendMessage, setMessageText}) => {

  const renderMessages = useCallback(()=>{

    const messageDivs = chatLog.map((item, index)=>{

      return (
        <div key={index} className="message">
          <Tooltip title={item.time}>
            <span className="message-username">{item.author.username}: </span>
          </Tooltip>
          <span>{item.text}</span>
        </div>
      )

    })

    return <div className="message-list">{messageDivs}</div>
  
  }, chatLog)

  return (
    <div className="chat-box">
      {renderMessages()}
      <form onSubmit={() => sendMessage()}>
        <input type="text" placeholder="Type something here..." onChange={(event) => setMessageText(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )

}

ChatBox.propTypes = {
  chatLog: PropTypes.array.isRequired,
  sendMessage: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired
}

export default ChatBox;