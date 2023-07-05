import { SOCKET } from '../types';
import { ClientLocationMessage } from '../../frontend/types';
import games from '../games';

export default function updatePlayerLocation(socket: SOCKET, message: ClientLocationMessage) {
  console.log('player location message received');
  const game = games[message.gameId];
  const player = game?.players?.find((player) => {
    return player.id === socket.id;
  });

  if (player) {
    player.location = message.player.location;
    console.log(`Lat: ${player.location?.lat} Lng: ${player.location?.lng}`);
    // TODO: Check if both player and runner/hunter are updated by reference
    // console.log(JSON.stringify(games[message.gameId]));
  }
}