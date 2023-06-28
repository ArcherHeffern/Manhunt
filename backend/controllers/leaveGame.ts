import { GameQueueBroadcast, ServerEvent, Game } from '../../frontend/types';
import { SOCKET } from '../types';
import games from '../games';

export default function leaveGame(socket: SOCKET) {
  // owner of room cannot leave their own room - instead, they shoudl end the game
  socket.rooms.forEach((gameId) => {
    const game = games[gameId] as Game;
    if (!game || socket.id === gameId) {
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