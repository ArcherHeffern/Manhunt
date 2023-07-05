import { Game, CreateGameResponse, StatusCode, isCreateGameRequest, ServerEvent, Player, GameStatus } from '../../frontend/types';
import { SOCKET } from '../types';
import games from '../games';

export default function createGame(socket: SOCKET, message: object) {
  if (isCreateGameRequest(message)) {
    let errorMessage = null;
    console.log('create new game request received');
    if (games[socket.id]) {
      errorMessage = 'User already has a game, and thus cannot create a new one';
    } else if (socket.rooms.size > 1) {
      errorMessage = 'User is already in a game, and thus cannot create a new one';
    }
    if (errorMessage) {
      const response: CreateGameResponse = {
        status: StatusCode.BAD_REQUEST,
        message: errorMessage,
      };
      socket.emit(ServerEvent.CREATE_GAME_RESPONSE, JSON.stringify(response));
      return;
    }
    const player: Player = {
      id: socket.id,
      name: message.username || 'Player ' + socket.id,
      location: undefined
    };

    const gameSettings = message.gameSettings;
    // Sanity checks
    errorMessage = null;
    if (gameSettings.maxPlayers < 2) {
      errorMessage = 'Not enough players';
    } else if (gameSettings.numHunters < 1) {
      errorMessage = 'Not enough hunters';
    } else if (gameSettings.numHunters >= gameSettings.maxPlayers) {
      errorMessage = 'Too many hunters';
    } else if (gameSettings.maxRounds < 1) {
      errorMessage = 'Not enough rounds';
    } else if (gameSettings.maxTime < 1) {
      errorMessage = 'Not enough time';
    } else if (gameSettings.gracePeriod < 1) {
      errorMessage = 'Not enough grace period';
    }
    if (errorMessage) {
      const response: CreateGameResponse = {
        status: StatusCode.BAD_REQUEST,
        message: errorMessage,
      };
      console.log('error creating game' + response.message);
      socket.emit(ServerEvent.CREATE_GAME_RESPONSE, JSON.stringify(response));
      return;
    }

    const game: Game = {
      id: socket.id,
      players: [player],
      hunters: [],
      runners: [],
      found: [],
      time: gameSettings.maxTime,
      grace: gameSettings.gracePeriod,
      status: GameStatus.WAITING,
      winner: undefined,
      created: new Date(),
      settings: {
        maxPlayers: gameSettings.maxPlayers,
        numHunters: gameSettings.numHunters,
        hunterInterval: gameSettings.hunterInterval,
        runnerInterval: gameSettings.runnerInterval,
        maxRounds: gameSettings.maxRounds,
        maxTime: gameSettings.maxTime,
        gracePeriod: gameSettings.gracePeriod,
        showDistance: gameSettings.showDistance,
        hotCold: gameSettings.hotCold,
      },
    };
    games[game.id] = game;

    const response: CreateGameResponse = {
      game: game,
      status: StatusCode.OK,
    };

    socket.emit(ServerEvent.CREATE_GAME_RESPONSE, JSON.stringify(response));
    console.log('game created');
  } else {
    const response: CreateGameResponse = {
      status: StatusCode.BAD_REQUEST,
      message: 'Invalid request',
    };
    console.log('bad request - create game');
    socket.emit(ServerEvent.CREATE_GAME_RESPONSE, JSON.stringify(response));
  }
}