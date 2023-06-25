import { SOCKET, homeProps } from "../../types/";
import { ClientMethod, Event, Game, JoinGameRequest, JoinGameResponse, ServerMethod, StatusCode, validateServerMessage } from "../../types";

export function addJoinGameListener(navigation: homeProps['navigation'], io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>, setErrorMessage: React.Dispatch<React.SetStateAction<string>>, closeModal: () => void) {
  io.on(Event.GAME, (data: object) => {
    data = JSON.parse(data as unknown as string);
    if (!validateServerMessage(data, ServerMethod.JOIN_GAME_RESPONSE)) {
      console.log('invalid server message');
      return;
    }
    const data2 = data as JoinGameResponse;
    if (data2.status === StatusCode.OK) {
      console.log('game joined successfully');
      setGame(data2.game);
      closeModal();
      navigation.navigate('WaitingQueue');
    }
    else {
      console.log('error joining game: ', data2.message);
      setErrorMessage(data2.message);
    }
  }
  )
}

export function joinGameEmitter(io: SOCKET, gameCode: string, username: string) {
  const joinGameRequest: JoinGameRequest = {
    gameId: gameCode,
    username
  }
  io.emit(ClientMethod.JOIN_GAME_REQUEST, joinGameRequest);
  console.log('emitted join game request');
}