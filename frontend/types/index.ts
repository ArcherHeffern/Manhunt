import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Game, GameModeSettings, Role } from '../types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/cjs';
import { GameSettings } from '../types';

export type GameContextValue = {game: Game, setGame: React.Dispatch<React.SetStateAction<Game>>};

export type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap>

export type reactStackParamList = {
  Home: undefined;
  Game: {role: Role };
  CreateGame: undefined;
  HowToPlay: undefined;
  WaitingQueue: undefined;
  GameDone: {reason: string};
}

export type navProps = NativeStackScreenProps<reactStackParamList>;
export type homeProps = NativeStackScreenProps<reactStackParamList, 'Home'>;
export type gameProps = NativeStackScreenProps<reactStackParamList, 'Game'>;
export type createGameProps = NativeStackScreenProps<reactStackParamList, 'CreateGame'>;
export type howToPlayProps = NativeStackScreenProps<reactStackParamList, 'HowToPlay'>;
export type waitingQueueProps = NativeStackScreenProps<reactStackParamList, 'WaitingQueue'>;
export type gameDoneProps = NativeStackScreenProps<reactStackParamList, 'GameDone'>;

export type actionType = {
  name: keyof GameModeSettings;
  value: [number|boolean, boolean]
}