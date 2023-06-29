import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from './socket';
import { ServerEvent } from './types';
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

export function createGameEndListener(navigation: navProps['navigation']) {
  socket.on(ServerEvent.GAME_END_BROADCAST, () => {
    console.log('game end broadcast received');
    navigation.popToTop();
    navigation.navigate('Home');
  })
  return () => {
    socket.off(ServerEvent.GAME_END_BROADCAST);
  }
}