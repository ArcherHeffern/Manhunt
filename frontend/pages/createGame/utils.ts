import { ClientEvent, ServerEvent, CreateGameResponse, StatusCode, Game } from '../../types';
import { createGameSettingsProps } from '../../types/';
import { GameSettings, CreateGameRequest } from '../../types';
import socket from '../../socket';

export function createGameEmitter(gameSettings: GameSettings, username: string|null = null, setErrormessage: React.Dispatch<React.SetStateAction<string|null>>) {
  if (!socket.connected) {
    setErrormessage('Not connected to server');
    return;
  }
  const gameRequest: CreateGameRequest = {
    gameSettings
  }
  if (username) {
    gameRequest.username = username;
  }
  socket.emit(ClientEvent.CREATE_GAME_REQUEST, gameRequest);
  console.log('emitted create game request');
}

export function addCreateGameListener(setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: createGameSettingsProps['navigation'], setErrorMessage: React.Dispatch<React.SetStateAction<string|null>>) {
  socket.on(ServerEvent.CREATE_GAME_RESPONSE, (data: CreateGameResponse) => {
    data = JSON.parse(data as unknown as string);
  if (data.status === StatusCode.OK) {
    console.log('game created successfully');
    setGame(data.game);
    navigation.popToTop();
    navigation.navigate('WaitingQueue');
  } else {
    setErrorMessage(data.message);
  }
  })
  return () => {
    socket.off(ServerEvent.CREATE_GAME_RESPONSE);
  }
}
