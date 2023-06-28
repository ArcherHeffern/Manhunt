import { SOCKET, homeProps } from "../../types/";
import { ServerEvent, ClientEvent, Game, JoinGameRequest, JoinGameResponse, StatusCode } from "../../types";

export function addJoinGameListener(navigation: homeProps['navigation'], io: SOCKET, setGame: React.Dispatch<React.SetStateAction<Game>>, setErrorMessage: React.Dispatch<React.SetStateAction<string>>, closeModal: () => void) {
  io.on(ServerEvent.JOIN_GAME_RESPONSE, (data: JoinGameResponse) => {
    data = JSON.parse(data as unknown as string);
    if (data.status === StatusCode.OK) {
      console.log('game joined successfully');
      setGame(data.game);
      closeModal();
      navigation.navigate('WaitingQueue');
    }
    else {
      console.log('error joining game: ', data.message);
      setErrorMessage(data.message);
    }
  }
  )
}

export function joinGameEmitter(io: SOCKET, gameCode: string, username: string) {
  const joinGameRequest: JoinGameRequest = {
    gameId: gameCode,
    username
  }
  io.emit(ClientEvent.JOIN_GAME_REQUEST, joinGameRequest);
  console.log('emitted join game request');
}