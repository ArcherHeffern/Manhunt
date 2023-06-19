import { Game, Player, isJoinGameRequest, JoinGameResponse, Method, StatusCode } from '../types';
import WebSocket from 'ws';

export default function joinGame(ws: WebSocket, message: object, games: { [key: string]: Game }) {
  if (isJoinGameRequest(message)) {
    if (games[message.gameId] === undefined) {
      const response: JoinGameResponse = {
        method: Method.JOIN_GAME_RESPONSE,
        status: StatusCode.GAME_NOT_FOUND,
        message: 'Game not found',
      };
      ws.send(JSON.stringify(response));
    } else {
      const player: Player = {
        id: message.userId,
        name: message.username || 'Player ' + message.userId,
      };
      games[message.gameId].players.push(player);
      const response: JoinGameResponse = {
        method: Method.JOIN_GAME_RESPONSE,
        status: StatusCode.OK,
        message: 'Joined game',
        game: games[message.gameId],
      };
      ws.send(JSON.stringify(response));
      // TODO: Broadcast to all users in game
    }
  }
}