import { ClientGameMessage, Game, Clients, isLeaveGameMessage } from '../types';
import WebSocket from 'ws';

export default function leaveGame(ws: WebSocket, message: ClientGameMessage, game: Game, clients: Clients, id: number) {
  if (isLeaveGameMessage(message)) {
    const player = game.players.find(player => player.id === id);
    if (player) {
      game.players = game.players.filter(player => player.id !== id);
      const broadcast: ClientGameMessage = {
        method: message.method,
        userId: id,
        gameId: message.gameId,
      };
      for (const player of game.players) {
        const con = clients[player.id];
        con.send(JSON.stringify(broadcast));
      }
    }
  }}