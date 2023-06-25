import { SOCKET } from '../../types/';
import { Game, Event, validateServerMessage, ServerMethod, StatusCode, CreateGameResponse, GameQueueBroadcast } from '../../types';

export function createPlayerJoinListener(io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  io.on(Event.GAME, (data: object) => {
    console.log('hit');
    data = JSON.parse(data as unknown as string);
    if (!validateServerMessage(data, ServerMethod.GAME_QUEUE_BROADCAST)) {
      console.log('Not a game queue broadcast');
      return;
    }
    const data2 = data as GameQueueBroadcast;
      console.log('player joined successfully');
      setGame((game) => {
        return {
        ...game,
        players: data2.players
      }});
  })
}