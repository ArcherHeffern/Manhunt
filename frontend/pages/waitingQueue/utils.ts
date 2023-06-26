import { SOCKET } from '../../types/';
import { Game, ServerEvent, GameQueueBroadcast } from '../../types';

export function createPlayerJoinListener(io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  io.on(ServerEvent.GAME_QUEUE_BROADCAST, (data: GameQueueBroadcast) => {
    data = JSON.parse(data as unknown as string);
    setGame((game) => {
      return {
        ...game,
        players: data.players
      }
    });
  })
}