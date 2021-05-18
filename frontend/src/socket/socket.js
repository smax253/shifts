
import { io } from 'socket.io-client';

let socket;


// eslint-disable-next-line no-unused-vars
const useEffectSocket = ({ symbol, addMessage, setCurrentPrice, setUsersList, userToken }) => {
  socket = io('http://localhost:3001', { query: { symbol, userToken }, forceNew: false });
  const cb = () => {
    socket.on('connect', () => {
      console.log('connection: ', socket.connected)
    })
    socket.on('price', (price) => {

      setCurrentPrice.current(price);
    
    })
    socket.on('chat', (message) => {
      
      addMessage.current(message);
    
    })
    socket.on('users-update', (users) => {

      setUsersList(users);

    })
    
    return () => socket.disconnect();

  }

  return cb;

}

const sendMessageSocket = ({ message }) => {
  
  if (!socket) return;
  socket.emit('message', message);

}

export default {sendMessageSocket, useEffectSocket}