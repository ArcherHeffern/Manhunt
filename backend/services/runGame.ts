import { IO } from '../types';
import { Game, ServerEvent, GameStartBroadcast, Role, GameStatus, GameTimeBroadcast, LocationMessage, GameOverBroadcast } from '../../frontend/types';
import Games from '../games';
import findClosestPlayer from './findClosestPlayer';

export default async function runGame(io: IO, gameId: string) {

  function gracePeriod() {
    return new Promise<void>((resolve) => {
      const graceInterval = setInterval(() => {
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED || game.grace <= 0) {
          io.to(gameId).emit(ServerEvent.GRACE_OVER_BROADCAST);
          clearInterval(graceInterval);
          game.status = GameStatus.RUNNING;
          resolve();
        }
        const broadcast: GameTimeBroadcast = {
          time: game.settings.gracePeriod,
          type: GameStatus.GRACE,
        };
        io.to(gameId).emit(ServerEvent.GAME_TIME_BROADCAST, broadcast);
        game.grace--;
      }, 1000);
    });
  }

  function generalPlayerLoop() {
    return new Promise<void>((resolve) => {
      const playerInterval = setInterval(() => {
        // Check for game end
        let reason = '';
        let winner: Role|null = null;
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED) {
          clearInterval(playerInterval);
          resolve();
        } else if (game.time <= 0) {
          reason = 'Time ran out';
          winner = Role.RUNNER;
        } else if (hunters.length === 0) {
          reason = 'All hunters have been eliminated or left the game';
          winner = Role.RUNNER;
        } else if (runners.length === game.found.length) {
          reason = 'All runners have been eliminated';
          winner = Role.HUNTER;
        }
        if (reason && winner) {
          clearInterval(playerInterval);
          const broadcast: GameOverBroadcast = {
            winner,
            reason
          };
          io.to(gameId).emit(ServerEvent.GAME_OVER_BROADCAST, broadcast);
          game.status = GameStatus.ENDED;
          resolve();
        }
        const broadcast: GameTimeBroadcast = {
          time: game.time,
          type: GameStatus.RUNNING,
        };
        io.to(gameId).emit(ServerEvent.GAME_TIME_BROADCAST, broadcast);
        game.time--;
      }, 1000);
    });
  }

  function runnerLoop() {
    return new Promise<void>((resolve) => {
      const runnerInterval = setInterval(() => {
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED) {
          clearInterval(runnerInterval);
          resolve();
        }
        for (const runner of runners) {
          const closestPlayer = findClosestPlayer(runner, hunters);
          const broadcast: LocationMessage = {
            player: closestPlayer,
          };
          io.sockets.sockets.get(runner.id)?.emit(ServerEvent.PLAYER_LOCATION_BROADCAST, broadcast);
        }
      }, game.settings.runnerInterval);
    });
  }

  function hunterLoop() {
    return new Promise<void>((resolve) => {
      const hunterInterval = setInterval(() => {
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED) {
          clearInterval(hunterInterval);
          resolve();
        }
        for (const hunter of hunters) {
          const closestPlayer = findClosestPlayer(hunter, runners);
          const broadcast: LocationMessage = {
            player: closestPlayer,
          };
          io.sockets.sockets.get(hunter.id)?.emit(ServerEvent.PLAYER_LOCATION_BROADCAST, broadcast);
        }
      }, game.settings.hunterInterval);
    });
  }

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

  await gracePeriod();
  Promise.all([
    await generalPlayerLoop(),
    await runnerLoop(),
    await hunterLoop(),
  ]);

}