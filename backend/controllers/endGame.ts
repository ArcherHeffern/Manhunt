import { SOCKET, IO } from '../types';
import { ServerEvent } from '../../frontend/types';
import games from '../games';

export default function endGame(io: IO, socket: SOCKET) {
  const gameId = socket.id;
  const game = games[gameId];
  if (!game) {
    console.log('game not found');
    return;
  }
  io.to(gameId).emit(ServerEvent.GAME_END_BROADCAST);
  for (const player of game.players) {
    const clientSocket = io.sockets.sockets.get(player.id);
    clientSocket?.leave(gameId);
  }
  delete games[gameId];
  console.log('game ended');
  return;

}