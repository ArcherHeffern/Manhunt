import { GameQueueBroadcast, ServerEvent, Game } from '../../frontend/types';
import { SOCKET } from '../types';
import endGame from './endGame';
import games from '../games';

export default function leaveGame(socket: SOCKET) {
  // find the room that is not the users socket.id, or if the size is 1, then just use that but also delete the game or handle accordingly since
  // the user is the owner
  if (socket.rooms.size === 1) {
    endGame(socket);
  } else {
    socket.rooms.forEach((gameId) => {
      const game = games[gameId] as Game;
      if (!game || socket.id !== gameId) {
        return;
      }
      socket.leave(gameId);
      game.players = game.players.filter(player => player.id !== socket.id);
      const broadcast: GameQueueBroadcast = {
        players: game.players,
      };
      socket.to(gameId).emit(ServerEvent.GAME_QUEUE_BROADCAST, JSON.stringify(broadcast));
      console.log('player left game');
    });
  }
}