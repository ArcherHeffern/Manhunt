import { Game, CreateGameResponse, StatusCode, isCreateGameRequest, Method, Player } from '../types';
import WebSocket from 'ws';

export default function createGame(ws: WebSocket, message: object, games: { [key: string]: Game }, gameId: number) {
  if (isCreateGameRequest(message)) {
    console.log('create new game');
    const player: Player = {
      id: message.userId,
      name: message.userName || 'Player ' + message.userId,
      location: undefined
    };

    const gameSettings = message.gameSettings;
    const game: Game = {
      id: gameId,
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
      method: Method.CREATE_GAME_RESPONSE,
      game: game,
      status: StatusCode.OK,
    };

    ws.send(JSON.stringify(response));
  } else {
    const response: CreateGameResponse = {
      method: Method.CREATE_GAME_RESPONSE,
      status: StatusCode.BAD_REQUEST,
    };
    ws.send(JSON.stringify(response));
  }
}