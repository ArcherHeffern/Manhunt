import { SOCKET, IO } from '../types';
import { ServerEvent } from '../../frontend/types';
import games from '../games';

export default function endGame(io: IO, socket: SOCKET) {
  if (!games[socket.id]) {
    return;
  }
  const gameId = socket.id;
  delete games[gameId];
  io.to(gameId).emit(ServerEvent.GAME_END_BROADCAST);
  const clients = io.sockets.adapter.rooms.get(gameId) || new Set();
  for (const clientId of clients) {
    const clientSocket = io.sockets.sockets.get(clientId);
    clientSocket?.leave('Other Room');
  }
  console.log('game ended');
  return;

}