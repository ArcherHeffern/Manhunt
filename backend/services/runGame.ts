import { IO } from '../types';
import { Game, ServerEvent, GameStartBroadcast, Role, GameStatus, GameTimeBroadcast, GameOverBroadcast, ServerLocationMessage, timeUntilNextLocationBroadcast } from '../../frontend/types';
import games from '../games';
import findClosestPlayer from './findClosestPlayer';

export default async function runGame(io: IO, gameId: string) {

  function startingGame() {
    return new Promise<void>((resolve) => {
      console.log('starting game');
      setTimeout(() => {
        resolve();
      }, 9000);
    });
  }

  function gracePeriod() {
    return new Promise<void>((resolve) => {
      console.log('grace period starting');
      const graceInterval = setInterval(() => {
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED || game.grace <= 0) {
          io.to(gameId).emit(ServerEvent.GRACE_OVER_BROADCAST);
          clearInterval(graceInterval);
          game.status = GameStatus.RUNNING;
          resolve();
        }
        const broadcast: GameTimeBroadcast = {
          time: game.grace,
          type: GameStatus.GRACE,
        };
        io.to(gameId).emit(ServerEvent.GAME_TIME_BROADCAST, broadcast);
        game.grace--;
      }, 1000);
    });
  }

  function generalPlayerLoop() {
    return new Promise<void>((resolve) => {
      let runnerIterations = 0;
      let hunterIterations = 0;

      //* General player loop
      const playerInterval = setInterval(() => {
        // Check for game end
        let reason = '';
        let winner: Role | null = null;
        if (!game || game.status === GameStatus.ENDED || game.status === GameStatus.COMPLETED) {
          clearInterval(playerInterval);
          resolve();
        } else if (game.time <= 0) {
          reason = 'Time ran out';
          winner = Role.RUNNER;
        } else if (game.runners.length === 0) {
          reason = 'All runners have been eliminated and/or left the game';
          winner = Role.HUNTER;
        } else if (game.hunters.length === 0) {
          reason = 'All hunters have been eliminated or left the game';
          winner = Role.RUNNER;
        } else if (game.runners.length === game.found.length) {
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

        //* Runner Loop

        if (runnerIterations === 0) {
          // send a location message to all runners
          for (const runner of game.runners) {
            const closestPlayer = findClosestPlayer(runner, game.hunters);
            const broadcast: ServerLocationMessage = {
              player: closestPlayer,
            };
            io.sockets.sockets.get(runner.id)?.emit(ServerEvent.PLAYER_LOCATION_BROADCAST, broadcast);
          }
        }
        {
          // send a time left until location message to all runners
          const broadcast: timeUntilNextLocationBroadcast = {
            time: game.settings.runnerInterval - runnerIterations
          };
          for (const runner of game.runners) {
            io.sockets.sockets.get(runner.id)?.emit(ServerEvent.TIME_UNTIL_NEXT_LOCATION_BROADCAST, broadcast);
          }
        }
        runnerIterations = (runnerIterations + 1) % game.settings.runnerInterval;

        //* Hunter Loop
        if (hunterIterations === 0) {
          // send a location message to all hunters
          for (const hunter of game.hunters) {
            const closestPlayer = findClosestPlayer(hunter, game.runners);
            const broadcast: ServerLocationMessage = {
              player: closestPlayer,
            };
            io.sockets.sockets.get(hunter.id)?.emit(ServerEvent.PLAYER_LOCATION_BROADCAST, broadcast);
          }
        }
        {
          // send a time left until location message to all hunters
          const broadcast: timeUntilNextLocationBroadcast = {
            time: game.settings.hunterInterval - hunterIterations
          };
          for (const hunter of game.hunters) {
            io.sockets.sockets.get(hunter.id)?.emit(ServerEvent.TIME_UNTIL_NEXT_LOCATION_BROADCAST, broadcast);
          }
        }
        hunterIterations = (hunterIterations + 1) % game.settings.hunterInterval;
      }, 1000);
    });
  }

  console.log('running game loop');
  console.log('picking teams');
  const game = games[gameId] as Game;
  game.status = GameStatus.GRACE;
  const numHunters = game.settings.numHunters >= game.players.length ? game.players.length - 2 : game.settings.numHunters;
  const numPlayers = game.players.length;

  // Assign roles

  const arrPlayers = Array.from(game.players);
  while (game.hunters.length < numHunters) {
    const randomPlayer = arrPlayers[Math.floor(Math.random() * numPlayers)];
    game.hunters.push(randomPlayer);
  }
  for (const player of game.players) {
    if (game.hunters.every(hunter => hunter.id !== player.id)) {
      game.runners.push(player);
    }
  }
  for (const hunter of game.hunters) {
    const broadcast: GameStartBroadcast = {
      role: Role.HUNTER,
      runners: game.runners,
      hunters: game.hunters,
    };
    io.sockets.sockets.get(hunter.id)?.emit(ServerEvent.GAME_START_BROADCAST, broadcast);
  }
  for (const runner of game.runners) {
    const broadcast: GameStartBroadcast = {
      role: Role.RUNNER,
      runners: game.runners,
      hunters: game.hunters,
    };
    io.sockets.sockets.get(runner.id)?.emit(ServerEvent.GAME_START_BROADCAST, broadcast);
  }

  await startingGame();
  await gracePeriod();
  await generalPlayerLoop();

  // TODO: Store game in database
  for (const player of game.players) {
    const clientSocket = io.sockets.sockets.get(player.id);
    if (clientSocket) {
      clientSocket.leave(gameId);
    }
  }
  delete games[gameId];
  console.log('game ended');

}