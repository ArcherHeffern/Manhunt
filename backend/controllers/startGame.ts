import { ServerEvent, StartGameResponse, StatusCode, Game, GameStatus } from '../../frontend/types';
import { SOCKET, IO } from '../types';
import games from '../games';
import runGame from '../services/runGame';

export default function startGame(io: IO, socket: SOCKET) {
  console.log('start game recieved');
  const gameId = socket.id;
  const game = games[gameId] as Game;
  // Sanity checks
  let errorMessage = null;
  if (!game) {
    errorMessage = 'Game does not exist';
  } else if (game.status === GameStatus.RUNNING || game.status === GameStatus.GRACE) {
    errorMessage = 'Game already started';
  } else if (game.status === GameStatus.OVER) {
    errorMessage = 'Game already finished';
  } else if (game.players.length < 2) {
    errorMessage = 'Not enough players';
  } else if (game.id !== socket.id) {
    errorMessage = 'Only the game owner can start the game';
  } 
  if (errorMessage) {
    const response: StartGameResponse = {
      status: StatusCode.BAD_REQUEST,
      message: errorMessage,
    };
    console.log('error starting game' + response.message);
    io.to(gameId).emit(ServerEvent.START_GAME_RESPONSE, response);
    return;
  } else {
    runGame(io, gameId);
  }
}