import express from 'express';
import routes from './http.routes';
import cors from 'cors';
import { WebSocket, WebSocketServer } from 'ws';
import { IdGenerator } from './helpers';
import http from 'http';

import { Clients, Method, ServerResponse, Games, isClientGameMessage, isClientMessage, ClientGameMessage, ConnectResponse, StatusCode } from './types';
import createGame from './controllers/createGame';
import joinGame from './controllers/joinGame';
import leaveGame from './controllers/leaveGame';

const PORT = 8080;

const app = express();
const server = http.createServer(app);

const clients: Clients = {};
const games: Games = {};

const userIdGen = IdGenerator();
const gameIdGen = IdGenerator();


const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  const id = userIdGen.next().value;
  let gameId: number|null=null;
  clients[id] = ws;
  console.log('New connection ' + id);
  ws.send(JSON.stringify({
    method: Method.CONNECT_RESPONSE,
    userId: id,
  } as ConnectResponse));

  ws.on('message', (unparsed_message: string) => {
    let message: object;
    try {
      message = JSON.parse(unparsed_message);
      if (!message) {
        ws.send(JSON.stringify({status: StatusCode.BAD_REQUEST, method: Method.ERROR_RESPONSE} as ServerResponse));
        return;
      }
    } catch (e) {
      ws.send(JSON.stringify({status: StatusCode.BAD_REQUEST, method: Method.ERROR_RESPONSE} as ServerResponse));
      return;
    }
    if ((message as ClientGameMessage).userId != id) {
      ws.send(JSON.stringify({status: StatusCode.INVALID_USER_ID_ERROR, method: Method.ERROR_RESPONSE} as ServerResponse));
      return;
    }
    else if (isClientGameMessage(message)) {
      const game = games[message.gameId];
      if (!game) {
        ws.send(JSON.stringify({status: StatusCode.GAME_NOT_FOUND, method: Method.ERROR_RESPONSE} as ServerResponse));
        return;
      }
      //* Game messages //
      switch (message.method) {
      case Method.JOIN_GAME_REQUEST:
        joinGame(ws, message, game, clients, id);
        break;
      case Method.START_GAME_REQUEST:
        ws.send('Not yet implemented');
        // startGame(ws, message, games, id);
        break;
      case Method.LEAVE_GAME_MESSAGE:
        leaveGame(ws, message, game, clients, id);
        break;
      default:
        ws.send(JSON.stringify({status: StatusCode.METHOD_NOT_FOUND, method: Method.ERROR_RESPONSE} as ServerResponse));
        break;
      }
      //* Client messages //
    } else if (isClientMessage(message)) {
      switch (message.method) {
      case Method.CREATE_GAME_REQUEST:
        gameId = gameIdGen.next().value as number;
        if (!createGame(ws, message, games, gameId)) {
          gameId = null;
        }
        break;
      default:
        ws.send(JSON.stringify({status: StatusCode.METHOD_NOT_FOUND, method: Method.ERROR_RESPONSE} as ServerResponse));
        break;
      }
    } else {
      ws.send(JSON.stringify({status: StatusCode.METHOD_NOT_FOUND, method: Method.ERROR_RESPONSE} as ServerResponse));
    }

    ws.on('close', () => {
      console.log('Connection closed ' + id);
      delete clients[id];
      if (gameId) {
        leaveGame(ws, {method: Method.LEAVE_GAME_MESSAGE, userId: id, gameId: gameId} as ClientGameMessage, games[gameId], clients, id);
      }
      // TODO: Set random person to owner, or delete the game if no one is left 
    });
  });

  return wss;
}
);

app.use(cors());
app.use(routes);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server is running at ws://localhost:${PORT}`);
});
