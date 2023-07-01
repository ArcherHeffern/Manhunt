import { io } from 'socket.io-client';

const URL = 'ws://localhost:8000';
const URL2 = 'ws://172.20.174.43:8000';

export default io(URL2);