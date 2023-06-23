import { Game, Player, isJoinGameRequest, JoinGameResponse, StatusCode, GameQueueBroadcast, Event, ServerMethod } from '../../frontend/types';
import { SOCKET } from '../types';
import games from '../games';

export default function joinGame(socket: SOCKET, message: object) {
  if (isJoinGameRequest(message)) {
    let game = games[message.gameId] as Game;
    let resMessage = '';
    if (!game) {
      resMessage = 'Game does not exist';
    } else if (socket.rooms.size > 1) {
      resMessage = 'Already in a game';
    } else if (game.finished) {
      resMessage = 'Game has already finished';
    } else if (game.started) {
      resMessage = 'Game has already started';
    } else if (game.players.find(player => player.id === socket.id)) {
      // TODO: Could perhaps later just switch them instead of denying
      resMessage = 'Already in this game';
    } else if (game.players.length >= game.settings.maxPlayers) {
      resMessage = 'Game is full';
    } else if (game.players.find(player => player.name === message.username)) {
      resMessage = 'Username already taken';
    } 
    if (resMessage) {
      const response: JoinGameResponse = {
        method: ServerMethod.JOIN_GAME_RESPONSE,
        status: StatusCode.BAD_REQUEST,
        message: resMessage,
      };
      socket.emit(Event.GENERAL, JSON.stringify(response));
    } else {
      game = game as Game;
      const player: Player = {
        id: socket.id,
        name: message.username || 'Player ' + socket.id,
      };
      game.players.push(player);
      const response: JoinGameResponse = {
        method: ServerMethod.JOIN_GAME_RESPONSE,
        status: StatusCode.OK,
        game,
      };
      
      const players = game.players;
      const broadcast: GameQueueBroadcast = {
        method: ServerMethod.GAME_QUEUE_BROADCAST,
        players,
      };

      socket.join(game.id);
      socket.emit(Event.GENERAL, JSON.stringify(response));
      socket.to(game.id).emit(Event.GAME, JSON.stringify(broadcast));
    }
  }
}