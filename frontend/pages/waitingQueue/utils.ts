import { SOCKET, waitingQueueProps } from '../../types/';
import { Game, ServerEvent, ClientEvent, GameQueueBroadcast, Role, GameStartBroadcast, StartGameResponse, StatusCode, GameStatus } from '../../types';

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

export function createStartGameListener(socket: SOCKET, setErrormessage: React.Dispatch<React.SetStateAction<string>>) {
  socket.on(ServerEvent.START_GAME_RESPONSE, (message: StartGameResponse) => {
    console.log('start game response received');
    if (message.status === StatusCode.OK) {
      console.log('game started');
    } else {
      setErrormessage(message.message);
    }
  })
}

export function createGameStartListener(io: SOCKET, navigation: waitingQueueProps['navigation'], setCountdown: React.Dispatch<React.SetStateAction<number>>, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  io.on(ServerEvent.GAME_START_BROADCAST, (message: GameStartBroadcast) => {
    console.log('game start broadcast received');
    setGame((game) => {
      return {
        ...game,
        status: GameStatus.GRACE
      }
    });
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown > 1) {
          return countdown - 1;
        } else {
          clearInterval(interval);
          navigation.popToTop();
          navigation.navigate('Game', {role: message.role});
          return countdown;
        }
      });
    }, 1000);
  })
}

export function createGameEndListener(socket: SOCKET, navigation: waitingQueueProps['navigation']) {
  socket.on(ServerEvent.GAME_END_BROADCAST, () => {
    console.log('game end broadcast received');
    navigation.popToTop();
    navigation.navigate('Home');
  })
}

export function startGame(socket: SOCKET) {
  socket.emit(ClientEvent.START_GAME_REQUEST);
}

export function endGame(socket: SOCKET) {
  socket.emit(ClientEvent.END_GAME_MESSAGE);
}

export function leaveGame(navigation: waitingQueueProps['navigation'], socket: SOCKET) {
  socket.emit(ClientEvent.LEAVE_GAME_MESSAGE);
  navigation.popToTop();
  navigation.navigate('Home');
}
