import { waitingQueueProps } from '../../types/';
import { Game, ServerEvent, ClientEvent, GameQueueBroadcast, Role, GameStartBroadcast, StartGameResponse, StatusCode, GameStatus } from '../../types';
import { createGameEndListener, leaveGame } from '../../common';
import socket from '../../socket';

export { createGameEndListener };

export function gameQueueBroadcastListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
  socket.on(ServerEvent.GAME_QUEUE_BROADCAST, (data: GameQueueBroadcast) => {
    console.log('game queue broadcast received');
    data = JSON.parse(data as unknown as string);
    setGame((game) => {
      return {
        ...game,
        players: data.players
      }
    });
  })
  return () => {
    socket.off(ServerEvent.GAME_QUEUE_BROADCAST);
  }
}

export function createStartGameListener(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
  socket.on(ServerEvent.START_GAME_RESPONSE, (message: StartGameResponse) => {
    console.log('start game response received');
    if (message.status === StatusCode.OK) {
      console.log('game started');
    } else {
      setErrorMessage(message.message);
    }
  })
  return () => {
    return socket.off(ServerEvent.START_GAME_RESPONSE);
  }
}

export function createGameStartListener(navigation: waitingQueueProps['navigation'], setCountdown: React.Dispatch<React.SetStateAction<number>>, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  socket.on(ServerEvent.GAME_START_BROADCAST, (message: GameStartBroadcast) => {
    console.log('game start broadcast received');
    setGame((game) => {
      return {
        ...game,
        status: GameStatus.GRACE,
        runners: message.runners,
        hunters: message.hunters
      }
    });
    setCountdown(3);
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
  return () => {
    socket.off(ServerEvent.GAME_START_BROADCAST);
  }
}

export function startGame() {
  socket.emit(ClientEvent.START_GAME_REQUEST);
}

export function endGame(navigation: waitingQueueProps['navigation']) {
  socket.emit(ClientEvent.END_GAME_MESSAGE);
  navigation.popToTop();
}

export { leaveGame }