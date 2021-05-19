import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import socket from '../../socket/socket';

const ChatBox = ({chatLog}) => {
  console.log('chat', chatLog);
  const [messageText, setMessageText] = useState('');
  const renderMessages = useCallback(()=>{

    const messageDivs = chatLog.map((item, index)=>{

      return (
        <div key={index} className="message">
          <Tooltip title={new Date(item.time).toString()}>
            <span className="message-username">{item.author}: </span>
          </Tooltip>
          <span>{item.text}</span>
        </div>
      )

    })

    return <div className="message-list">{messageDivs}</div>
  
  }, [chatLog])

  return (
    <div className="chat-box">
      {renderMessages()}
      <form onSubmit={(event) => {

        event.preventDefault()
        setMessageText('');
        socket.sendMessageSocket({ message: messageText });
        
      }
      }>
        <label htmlFor="chat-input" className="hidden">
          Type something here...
        </label>
        <input id="chat-input" type="text" placeholder="Type something here..." value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
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