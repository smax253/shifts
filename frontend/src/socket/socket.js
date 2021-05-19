
import { io } from 'socket.io-client';

let socket;


// eslint-disable-next-line no-unused-vars
const useEffectSocket = ({ symbol, addMessage, setCurrentPrice, setUsersList, userToken }) => {
  socket = io(process.env.REACT_APP_BACKEND_URI || 'http://localhost:4000', { query: { symbol, userToken }, forceNew: false });
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
      setUsersList.current(users);

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