import { SOCKET, IO } from '../types';
import games from '../games';

export default function endGame(io: IO, socket: SOCKET) {
  delete games[socket.id];
  // TODO: find a way to iterate over all clients - general message them, and then disconnect them
  io.socketsLeave(socket.id);
  console.log('game ended');
  return;
}