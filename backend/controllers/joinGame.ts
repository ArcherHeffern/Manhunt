import { Game, Player, isJoinGameRequest, JoinGameResponse, StatusCode, GameQueueBroadcast, ServerEvent, GameStatus } from '../../frontend/types';
import { SOCKET } from '../types';
import games from '../games';

export default function joinGame(socket: SOCKET, message: object) {
  console.log('join game request received');
  if (isJoinGameRequest(message)) {
    let game = games[message.gameId] as Game;
    let resMessage = '';
    if (!game) {
      resMessage = 'Game does not exist';
    } else if (socket.rooms.size > 1) {
      resMessage = 'Already in a game';
    } else if (game.status === GameStatus.COMPLETED || game.status === GameStatus.ENDED) {
      resMessage = 'Game has already finished';
    } else if (game.status === GameStatus.RUNNING || game.status === GameStatus.GRACE) {
      resMessage = 'Game has already started';
    } else if (game.players.find(player => player.id === socket.id)) {
      resMessage = 'Already in this game';
    } else if (game.players.length >= game.settings.maxPlayers) {
      resMessage = 'Game is full';
    } else if (game.players.find(player => player.name === message.username)) {
      resMessage = 'Username already taken';
    } 
    if (resMessage) {
      const response: JoinGameResponse = {
        status: StatusCode.BAD_REQUEST,
        message: resMessage,
      };
      socket.emit(ServerEvent.JOIN_GAME_RESPONSE, JSON.stringify(response));
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
      socket.emit(ServerEvent.JOIN_GAME_RESPONSE, JSON.stringify(response));
      socket.to(game.id).emit(ServerEvent.GAME_QUEUE_BROADCAST, JSON.stringify(broadcast));
    }
  }
}