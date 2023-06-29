import { IO } from '../types';
import { Game, ServerEvent, GameStartBroadcast, Role } from '../../frontend/types';
import Games from '../games';

export default function runGame(io: IO, gameId: string) {
  console.log('run game');
  const game = Games[gameId] as Game;
  game.started = true;
  const hunters = game.hunters;
  const runners = game.runners;
  const players = game.players;
  const numHunters = game.settings.numHunters >= game.players.length ? game.players.length - 1 : game.settings.numHunters;
  const numPlayers = game.players.length;

  const arrPlayers = Array.from(players);
  while (hunters.length < numHunters) {
    const randomPlayer = arrPlayers[Math.floor(Math.random() * numPlayers)];
    hunters.push(randomPlayer);
  }
  for (const player of players) {
    if (hunters.some(hunter => hunter.id !== player.id)) {
      runners.push(player);
      const broadcast: GameStartBroadcast = {
        role: Role.RUNNER,
      };
      io.to(player.id).emit(ServerEvent.GAME_START_BROADCAST, broadcast);
    }
  }
  for (const hunter of hunters) {
    const broadcast: GameStartBroadcast = {
      role: Role.HUNTER,
    };
    io.to(hunter.id).emit(ServerEvent.GAME_START_BROADCAST, broadcast);
  }
  // Assign roles
}