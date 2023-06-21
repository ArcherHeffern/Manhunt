import { Game, CreateGameResponse, StatusCode, isCreateGameRequest, ServerMethod, Player, SOCKET, Namespace } from '../types';
import games from '../games';

export default function createGame(socket: SOCKET, message: object) {
  if (isCreateGameRequest(message)) {
    if (games[socket.id]) {
      const response: CreateGameResponse = {
        status: StatusCode.ALREADY_IN_GAME,
      };
      // TODO: Check if user is already in room or already has a game and send error 
      socket.emit(ServerMethod.CREATE_GAME_RESPONSE, JSON.stringify(response));
      return;
    }
    console.log('create new game');
    const player: Player = {
      id: socket.id,
      name: message.username || 'Player ' + socket.id,
      location: undefined
    };

    const gameSettings = message.gameSettings;
    const game: Game = {
      id: socket.id,
      players: [player],
      hunters: [],
      found: [],
      time: 0,
      started: false,
      finished: false,
      winner: null,
      creator: player.name,
      created: new Date(),
      settings: {
        maxPlayers: gameSettings.maxPlayers,
        numHunters: gameSettings.numHunters,
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

    socket.emit(Namespace.GAME, JSON.stringify(response));
    console.log('game created');
  } else {
    const response: CreateGameResponse = {
      status: StatusCode.BAD_REQUEST,
    };
    console.log('bad request');
    socket.emit(Namespace.GENERAL, JSON.stringify(response));
  }
}