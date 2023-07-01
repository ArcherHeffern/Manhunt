import { IO } from '../types';
import { Game, ServerEvent, GameStartBroadcast, Role, GameStatus } from '../../frontend/types';
import Games from '../games';

export default function runGame(io: IO, gameId: string) {
  console.log('run game');
  const game = Games[gameId] as Game;
  game.status = GameStatus.GRACE;
  const hunters = game.hunters;
  const runners = game.runners;
  const players = game.players;
  const numHunters = game.settings.numHunters >= game.players.length ? game.players.length - 2 : game.settings.numHunters;
  const numPlayers = game.players.length;

  // Assign roles

  const arrPlayers = Array.from(players);
  while (hunters.length < numHunters) {
    const randomPlayer = arrPlayers[Math.floor(Math.random() * numPlayers)];
    hunters.push(randomPlayer);
  }
  for (const player of players) {
    if (hunters.every(hunter => hunter.id !== player.id)) {
      runners.push(player);
    }
  }
  for (const hunter of hunters) {
    const broadcast: GameStartBroadcast = {
      role: Role.HUNTER,
      runners,
      hunters,
    };
    io.sockets.sockets.get(hunter.id)?.emit(ServerEvent.GAME_START_BROADCAST, broadcast);
  }
  for (const runner of runners) {
    const broadcast: GameStartBroadcast = {
      role: Role.RUNNER,
      runners,
      hunters,
    };
    io.sockets.sockets.get(runner.id)?.emit(ServerEvent.GAME_START_BROADCAST, broadcast);
  }

  // grace period

  // run game

  // end game
}