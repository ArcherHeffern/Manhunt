import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Game, Role } from '../types';
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
}

export type navProps = NativeStackScreenProps<reactStackParamList>;
export type homeProps = NativeStackScreenProps<reactStackParamList, 'Home'>;
export type gameProps = NativeStackScreenProps<reactStackParamList, 'Game'>;
export type createGameProps = NativeStackScreenProps<reactStackParamList, 'CreateGame'>;
export type howToPlayProps = NativeStackScreenProps<reactStackParamList, 'HowToPlay'>;
export type waitingQueueProps = NativeStackScreenProps<reactStackParamList, 'WaitingQueue'>;

export type actionType = {
  name: keyof GameSettings;
  value: string|number|boolean;
}