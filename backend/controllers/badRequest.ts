import WebSocket from 'ws';

export default function badRequest(ws: WebSocket, body: object, message?: string) {
  console.log('Received message ' + message);
  ws.send(`Received message \n\n'${JSON.stringify(body)}'\n\nBut ${message || ''}`);
}