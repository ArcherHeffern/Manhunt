import games from '../games';
import { SOCKET } from '../types';
import { Game, ServerEvent, PlayerFoundBroadcast, Player, GameStatus } from '../../frontend/types';

export default function playerFound(socket: SOCKET) {
  console.log('player found message received');
  const game = (Object.values(games).filter((game) => {
    return game?.runners?.find((player) => {
      return player.id === socket.id;
    });
  }) as Game[])[0];
  if (!game || game.status !== GameStatus.RUNNING) {
    console.log('Player not in a game or game is not running');
    return;
  }
  const player = Object.values(game.runners).find((player) => {
    return player.id === socket.id;
  }) as Player;
  game.found.push(player);

  const broadcast: PlayerFoundBroadcast = {
    player
  };
  socket.to(game.id).emit(ServerEvent.PLAYER_FOUND_BROADCAST, JSON.stringify(broadcast));
}