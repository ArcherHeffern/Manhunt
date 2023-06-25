import { IO } from '../types';
import { Event } from '../../frontend/types';
import games from '../games';

export function getGames(socket: IO) {
  socket.emit(Event.GAME, JSON.stringify(games));
}