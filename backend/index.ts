import express from 'express';
import routes from './http.routes';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { SOCKET } from './types';
import createGame from './controllers/createGame';
import endGame from './controllers/endGame';
import joinGame from './controllers/joinGame';
import leaveGame from './controllers/leaveGame';
import startGame from './controllers/startGame';
import { getGames } from './controllers/dev';
import { ClientEvent, ClientLocationMessage, DebugEvent} from '../frontend/types';
import playerFound from './controllers/playerFound';
import updatePlayerLocation from './controllers/updatePlayerLocation';

const PORT = 8000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket: SOCKET) => {
 
  socket.on(ClientEvent.CREATE_GAME_REQUEST, (message: object) => createGame(socket, message));
  socket.on(ClientEvent.END_GAME_MESSAGE, () => endGame(io, socket));
  socket.on(ClientEvent.JOIN_GAME_REQUEST, (message: object) => joinGame(socket, message));
  socket.on(ClientEvent.LEAVE_GAME_MESSAGE, () => leaveGame(socket));
  socket.on(ClientEvent.START_GAME_REQUEST, () => startGame(io, socket));
  socket.on(ClientEvent.PLAYER_FOUND_MESSAGE, () => playerFound(socket));
  socket.on(ClientEvent.PLAYER_LOCATION_MESSAGE, (message: ClientLocationMessage) => updatePlayerLocation(socket, message));

  socket.on(DebugEvent.GET_GAMES, () => getGames(socket));

  socket.on('disconnecting', () => {
    console.log('user disconnected');
    leaveGame(socket);
    endGame(io, socket);
  });

});

app.use(cors());
app.use(routes);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server is running at ws://localhost:${PORT}`);
});
