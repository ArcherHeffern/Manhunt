import { GameQueueBroadcast, SOCKET, Method } from '../types';
import games from '../games';

export default function leaveGame(socket: SOCKET) {
  const game = Object.values(games).find(game => game?.players.find(player => player?.id === socket.id));
  if (!game) return;
  const player = game.players.find(player => player.id === socket.id);
  if (player) {
    game.players = game.players.filter(player => player.id !== socket.id);
    const broadcast: GameQueueBroadcast = {
      players: game.players,
    };
    socket.to(game.id).emit(Method.GAME_QUEUE_BROADCAST, JSON.stringify(broadcast));
  }
}