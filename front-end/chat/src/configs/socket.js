import socketIO from 'socket.io-client';

const socket = socketIO('http://localhost:4000', { autoConnect: false });
export default socket;