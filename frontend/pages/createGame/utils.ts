import { ClientMethod, ServerMethod, Event, validateServerMessage, CreateGameResponse, StatusCode, Game } from '../../types';
import { formData, formFields, createGameProps, SOCKET, actionType } from '../../types';

export function createGame(io: SOCKET, formData: formData, setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: createGameProps['navigation']) {
  io.on(Event.GAME, (data: object) => {createGameListener(data, setGame, navigation)});
  io.emit(ClientMethod.CREATE_GAME_REQUEST, formData);
  console.log('emitted create game request');
  // find a way to remove this listener
}

function createGameListener(data: object, setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: createGameProps['navigation']) {
  if (!validateServerMessage(data, ServerMethod.CREATE_GAME_RESPONSE)) {
    console.log('invalid server message');
    return;
  }
  const data2 = data as CreateGameResponse;
  if (data2.status === StatusCode.OK) {
    console.log('game created successfully');
    // add game to gameContext
    setGame(data2.game);
    navigation.navigate('WaitingQueue');
  } else {
    console.log('error creating game: ', data2.message);
  }
}

export const curryDispatch = (name: formFields, formDispatch: React.Dispatch<actionType>) => {
  return (text: string) => {
    formDispatch({ name: name, value: text })
  }
}