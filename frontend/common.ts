import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from './socket';
import { ClientEvent, Game, GameStatus, ServerEvent } from './types';
import { navProps } from './types/';

export function getUsernameFromStorage(setUsername: React.Dispatch<React.SetStateAction<string|null>>) {
  AsyncStorage.getItem('username').then((username) => {
    if (username) {
      setUsername(username);
    }
  })
}

export function setUsernameInStorage(username: string) {
  AsyncStorage.setItem('username', username);
}

export function createGameEndListener(navigation: navProps['navigation'], setGame: React.Dispatch<React.SetStateAction<Game>>) {
  socket.on(ServerEvent.GAME_END_BROADCAST, () => {
    console.log('game end broadcast received');
    setGame((game) => {
        return {
            ...game,
            status: GameStatus.ENDED,
        }
    })
    navigation.popToTop();
    navigation.navigate('GameDone', { reason: 'Host has ended the game.' });
  })
  return () => {
    socket.off(ServerEvent.GAME_END_BROADCAST);
  }
}

export function leaveGame(navigation: navProps['navigation']) {
  socket.emit(ClientEvent.LEAVE_GAME_MESSAGE);
  navigation.popToTop();
}