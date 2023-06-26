import { SOCKET } from '../types';
import { DebugEvent } from '../../frontend/types';
import games from '../games';

export function getGames(socket: SOCKET) {
  socket.emit(DebugEvent.GET_GAMES, JSON.stringify(games));
}