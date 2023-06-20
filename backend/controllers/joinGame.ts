import { Game, Player, isJoinGameRequest, JoinGameResponse, Method, StatusCode, GameQueueBroadcast, SOCKET } from '../types';
import games from '../games';

export default function joinGame(socket: SOCKET, message: object) {
  if (isJoinGameRequest(message)) {
    let game = games[message.gameId];
    let status = null;
    // TODO: Check if user is already in a game or has a game and send error
    if (!game) {
      status = StatusCode.GAME_NOT_FOUND;
    } else if (game.finished) {
      status = StatusCode.GAME_IS_FINISHED;
    } else if (game.started) {
      status = StatusCode.GAME_IN_PROGRESS;
    } else if (game.players.find(player => player.id === socket.id)) {
      status = StatusCode.ALREADY_IN_GAME;
    } else if (game.players.length >= game.settings.maxPlayers) {
      status = StatusCode.GAME_IS_FULL;
    } else if (game.players.find(player => player.name === message.username)) {
      status = StatusCode.USERNAME_TAKEN;
    } 
    if (status) {
      const response: JoinGameResponse = {
        status,
      };
      socket.send(JSON.stringify(response));
    } else {
      game = game as Game;
      const player: Player = {
        id: socket.id,
        name: message.username || 'Player ' + socket.id,
      };
      game.players.push(player);
      const response: JoinGameResponse = {
        status: StatusCode.OK,
        game,
      };
      
      const players = game.players;
      const broadcast: GameQueueBroadcast = {
        players,
      };

      socket.join(game.id);
      socket.send(Method.JOIN_GAME_RESPONSE, JSON.stringify(response));
      socket.to(game.id).emit(Method.GAME_QUEUE_BROADCAST, JSON.stringify(broadcast));
    }
  }
}