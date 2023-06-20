import { Game, Player, isJoinGameRequest, JoinGameResponse, Method, StatusCode, GameQueueBroadcast, Clients } from '../types';
import WebSocket from 'ws';

export default function joinGame(ws: WebSocket, message: object, game: Game, clients: Clients, id: number) {
  if (isJoinGameRequest(message)) {
    let status = null;
    if (game.finished) {
      status = StatusCode.GAME_IS_FINISHED;
    } else if (game.started) {
      status = StatusCode.GAME_IN_PROGRESS;
    } else if (game.players.find(player => player.id === id)) {
      status = StatusCode.ALREADY_IN_GAME;
    } else if (game.players.length >= game.settings.maxPlayers) {
      status = StatusCode.GAME_IS_FULL;
    } else if (game.players.find(player => player.name === message.username)) {
      status = StatusCode.USERNAME_TAKEN;
    } 
    if (status) {
      const response: JoinGameResponse = {
        method: Method.JOIN_GAME_RESPONSE,
        status,
      };
      ws.send(JSON.stringify(response));
    } else {
      const player: Player = {
        id: message.userId,
        name: message.username || 'Player ' + message.userId,
      };
      game.players.push(player);
      const response: JoinGameResponse = {
        method: Method.JOIN_GAME_RESPONSE,
        status: StatusCode.OK,
        game,
      };
      ws.send(JSON.stringify(response));

      const players = game.players;
      const broadcast: GameQueueBroadcast = {
        method: Method.GAME_QUEUE_BROADCAST,
        players,
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