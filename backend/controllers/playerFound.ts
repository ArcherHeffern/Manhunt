import games from '../games';
import { SOCKET } from '../types';
import { Game, ServerEvent, PlayerFoundBroadcast, Player } from '../../frontend/types';

export default function playerFound(socket: SOCKET) {
  const game = games[socket.id] as Game;
  const player = Object.values(game.players).find((player) => {
    player.id === socket.id;
  }) as Player;
  game.players.push(player);

  const broadcast: PlayerFoundBroadcast = {
    player
  };
  socket.broadcast.emit(ServerEvent.PLAYER_FOUND_BROADCAST, JSON.stringify(broadcast));
}