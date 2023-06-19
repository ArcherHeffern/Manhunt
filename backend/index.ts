import express from 'express';
import routes from './http.routes';
import cors from 'cors';
// import dbConnect from './db_connect';
import { WebSocket, WebSocketServer } from 'ws';
import { IdGenerator } from './helpers';
import http from 'http';

import { Clients, Method, Game, isClientGameMessage, isClientMessage, ClientGameMessage, ConnectResponse } from './types';
import createGame from './controllers/createGame';
import joinGame from './controllers/joinGame';
import badRequest from './controllers/badRequest';

const PORT = 8080;

const app = express();
const server = http.createServer(app);
// const db = dbConnect();

const clients: Clients = {};
const games: { [key: string]: Game } = {};

const userIdGen = IdGenerator();
const gameIdGen = IdGenerator();


const wss = new WebSocketServer({ server });

wss.once('listening', () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});

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
        badRequest(ws, {message: unparsed_message}, 'Could not parse message');
        return;
      }
    } catch (e) {
      badRequest(ws, {message: unparsed_message}, 'Could not parse message');
      return;
    }
    if ((message as ClientGameMessage).userId != id) {
      badRequest(ws, message, 'User id did not match');
      return;
    }
    else if (isClientGameMessage(message)) {
      if (!games[message.gameId]) {
        badRequest(ws, message, 'Game id does not exist');
        return;
      }
      switch (message.method) {
      case Method.JOIN_GAME_REQUEST:
        joinGame(ws, message, games, clients);
        break;
      case Method.START_GAME_REQUEST:
        ws.send('Not yet implemented');
        // startGame(ws, message, games, id);
        break;
      default:
        badRequest(ws, message, 'Was a client game message but did not match any known methods');
        break;
      }
    } else if (isClientMessage(message)) {
      switch (message.method) {
      case Method.CREATE_GAME_REQUEST:
        gameId = gameIdGen.next().value as number;
        createGame(ws, message, games, gameId);
        break;
      default:
        badRequest(ws, message, 'Was a client message but did not match any known methods');
        break;
      }
    } else {
      badRequest(ws, message, 'Was not a client or client game message');
    }

    ws.on('close', () => {
      console.log('Connection closed ' + id);
      delete clients[id];
      if (typeof gameId ==='number') {
        delete games[gameId];
      }
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
