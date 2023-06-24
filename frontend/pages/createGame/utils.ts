import { ClientMethod, ServerMethod, Event, validateServerMessage, CreateGameResponse, StatusCode, Game } from '../../types';
import { createGameProps, SOCKET } from '../../types/';
import { GameSettings, CreateGameRequest } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function createGame(io: SOCKET, gameSettings: GameSettings, username: string|null = null) {
  const gameRequest: CreateGameRequest = {
    gameSettings
  }
  if (username) {
    gameRequest.username = username;
  }
  io.emit(ClientMethod.CREATE_GAME_REQUEST, gameRequest);
  console.log('emitted create game request');
}

export function createGameListener(io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: createGameProps['navigation']) {
  io.on(Event.GENERAL, (data: object) => {
    data = JSON.parse(data as unknown as string);
  if (!validateServerMessage(data, ServerMethod.CREATE_GAME_RESPONSE)) {
    console.log('invalid server message');
    return;
  }
  const data2 = data as CreateGameResponse;
  if (data2.status === StatusCode.OK) {
    console.log('game created successfully');
    setGame(data2.game);
    navigation.navigate('WaitingQueue');
  } else {
    console.log('error creating game: ', data2.message);
  }
  })
}

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