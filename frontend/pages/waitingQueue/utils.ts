import { SOCKET, waitingQueueProps } from '../../types/';
import { Game, ServerEvent, ClientEvent, GameQueueBroadcast } from '../../types';

export function gameQueueBroadcastListener(io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  io.on(ServerEvent.GAME_QUEUE_BROADCAST, (data: GameQueueBroadcast) => {
    console.log('game queue broadcast received');
    data = JSON.parse(data as unknown as string);
    setGame((game) => {
      return {
        ...game,
        players: data.players
      }
    });
  })
}

export function createGameStartListener(io: SOCKET, navigation: waitingQueueProps['navigation']) {
  io.on(ServerEvent.GAME_START_BROADCAST, () => {
    // TODO: Create a countdown timer before starting
    console.log('game start broadcast received');
    navigation.popToTop();
    navigation.navigate('Game');
  })
}

export function createGameEndListener(socket: SOCKET, navigation: waitingQueueProps['navigation']) {
  console.log('createGameEndListener')
  socket.on(ServerEvent.GAME_END_BROADCAST, () => {
    console.log('game end broadcast received');
    navigation.popToTop();
    navigation.navigate('Home');
  })
}

export function startGame(navigation: waitingQueueProps['navigation'], socket: SOCKET) {
  socket.emit(ClientEvent.START_GAME_MESSAGE);
  navigation.popToTop();
  navigation.navigate('Game');
}

export function endGame(navigation: waitingQueueProps['navigation'], socket: SOCKET) {
  socket.emit(ClientEvent.END_GAME_MESSAGE);
  navigation.popToTop();
  navigation.navigate('Home');
}

export function leaveGame(navigation: waitingQueueProps['navigation'], socket: SOCKET) {
  socket.emit(ClientEvent.LEAVE_GAME_MESSAGE);
  navigation.popToTop();
  navigation.navigate('Home');
}
