import { io } from 'socket.io-client';

const URL = 'ws://localhost:8000';
const URL2 = 'ws://172.20.174.43:8000';
const URL3 = 'ws://173.255.230.185:8000';

export default io(URL3);