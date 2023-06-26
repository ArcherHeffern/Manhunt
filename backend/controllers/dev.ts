import { IO } from '../types';
import { DebugEvent } from '../../frontend/types';
import games from '../games';

export function getGames(socket: IO) {
  socket.emit(DebugEvent.GET_GAMES, JSON.stringify(games));
}