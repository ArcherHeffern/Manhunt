import { SOCKET } from '../types';
import { ClientLocationMessage } from '../../frontend/types';
import games from '../games';

let num = 0;
export default function updatePlayerLocation(socket: SOCKET, message: ClientLocationMessage) {
  console.log(`player location message received ${num++} times`);
  const game = games[message.gameId];
  const player = game?.players?.find((player) => {
    return player.id === socket.id;
  });

  if (player) {
    player.location = message.player.location;
  }
}