import { GameQueueBroadcast, SOCKET, IO, ServerMethod, Namespace } from '../types';
import endGame from './endGame';
import games from '../games';

export default function leaveGame(io: IO, socket: SOCKET) {
  // find the room that is not the users socket.id, or if the size is 1, then just use that but also delete the game or handle accordingly since
  // the user is the owner
  if (socket.rooms.size === 1) {
    endGame(io, socket);
  } else {
    socket.rooms.forEach((gameId) => {
      const game = games[gameId];
      if (!game || socket.id !== gameId) {
        return;
      }
      socket.leave(gameId);
      game.players = game.players.filter(player => player.id !== socket.id);
      const broadcast: GameQueueBroadcast = {
        method: ServerMethod.GAME_QUEUE_BROADCAST,
        players: game.players,
      };
      socket.to(gameId).emit(Namespace.GAME, JSON.stringify(broadcast));
      console.log('player left game');
    });
  }
}