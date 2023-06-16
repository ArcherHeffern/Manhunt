import express from 'express';
import routes from './routes';
import cors from 'cors';
import dbConnect from './db_connect';
import { WebSocket } from 'ws';

const SERVER_PORT = 3333;
const WEBSOCKET_PORT = 8080;

const app = express();

dbConnect();

const wss = new WebSocket(`ws://127.0.0.1:${WEBSOCKET_PORT}`);

app.use(cors());
app.use(routes);

wss.on('open', () => {
    console.log('Connected to WebSocket server.');
    wss.send('Hi this is WebSocket server!');
});

wss.on('message', (message: any) => {
        console.log('Received Message:', message.utf8Data);
        wss.send('Hi this is WebSocket server!');

    });

wss.on('error', (error: any) => {
    console.log('WebSocket Error: ' + error);
});

wss.on('close', (reasonCode: any, description: any) => {
    console.log('Client has disconnected.');
});


app.listen(SERVER_PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${SERVER_PORT}`)
})
