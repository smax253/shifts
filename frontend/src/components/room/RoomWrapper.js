/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router';
import socket from '../../socket/socket';
import Room from './Room';
import auth from '../../config/auth'

const RoomWrapper = () => {
  const { id } = useParams();
  
  const [messages, setMessages] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const addMessageRef = useRef();
  
  useEffect(() => {
    auth.currentUser.getIdToken(true).then((idToken) => {
      setUserToken(idToken);
    })
  }, [])

  useEffect(() => {
    addMessageRef.current = (message) => {
      setMessages(messages.concat([message]));
    }
  }, [messages, setMessages])
  

  useEffect(() => {
    if (userToken) { 
      return (socket.useEffectSocket({
        symbol: id.toUpperCase(),
        addMessage: addMessageRef,
        userToken
      })());
    }
  }, [userToken, id])
    
  return <Room
    id={id}
    messages={messages}
    setMessages={setMessages}
  />
}

export default RoomWrapper;