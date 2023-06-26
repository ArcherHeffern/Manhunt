import { ClientEvent, ServerEvent, CreateGameResponse, StatusCode, Game } from '../../types';
import { createGameProps, SOCKET } from '../../types/';
import { GameSettings, CreateGameRequest } from '../../types';

export function createGameEmitter(io: SOCKET, gameSettings: GameSettings, username: string|null = null) {
  const gameRequest: CreateGameRequest = {
    gameSettings
  }
  if (username) {
    gameRequest.username = username;
  }
  io.emit(ClientEvent.CREATE_GAME_REQUEST, gameRequest);
  console.log('emitted create game request');
}

export function addCreateGameListener(io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: createGameProps['navigation']) {
  io.on(ServerEvent.CREATE_GAME_RESPONSE, (data: CreateGameResponse) => {
    data = JSON.parse(data as unknown as string);
  if (data.status === StatusCode.OK) {
    console.log('game created successfully');
    setGame(data.game);
    navigation.popToTop();
    navigation.navigate('WaitingQueue');
  } else {
    console.log('error creating game: ', data.message);
  }
  })
}
