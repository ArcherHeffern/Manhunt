import express from 'express';
import routes from './http.routes';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { Method, SOCKET } from './types';
import createGame from './controllers/createGame';
import endGame from './controllers/endGame';
import joinGame from './controllers/joinGame';
import leaveGame from './controllers/leaveGame';
import startGame from './controllers/startGame';

const PORT = 8080;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket: SOCKET) => {
 
  socket.on(Method.CREATE_GAME_REQUEST, (message: object) => createGame(socket, message));
  socket.on(Method.END_GAME_MESSAGE, () => endGame(socket));
  socket.on(Method.JOIN_GAME_REQUEST, (message: object) => joinGame(socket, message));
  socket.on(Method.LEAVE_GAME_MESSAGE, () => leaveGame(socket));
  socket.on(Method.START_GAME_MESSAGE, (message: object) => startGame(socket, message));
  // socket.on('disconnect', () => leaveGame(ws, { method: Method.LEAVE_GAME_MESSAGE, userId: id, gameId: gameId } as ClientGameMessage, games[gameId], clients, id));
});


// TODO: Set random person to owner, or delete the game if no one is left 

app.use(cors());
app.use(routes);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server is running at ws://localhost:${PORT}`);
});
