import { Game, Player, isJoinGameRequest, JoinGameResponse, Method, StatusCode, ServerBroadcast, GameQueueBroadcast, Clients } from '../types';
import WebSocket from 'ws';

export default function joinGame(ws: WebSocket, message: object, games: { [key: string]: Game }, clients: Clients) {
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

      const players = games[message.gameId].players;
      const broadcast: GameQueueBroadcast = {
        method: Method.GAME_QUEUE_BROADCAST,
        users: games[message.gameId].players,
      };
      for (const player of players) {
        if (player.id !== message.userId) {
          const con = clients[player.id];
          con.send(JSON.stringify(broadcast));
        }
      }
    }
  }
}