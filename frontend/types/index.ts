import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Game } from '../types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/cjs';

export type GameContextValue = [Game, React.Dispatch<React.SetStateAction<Game>>];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap>

export type reactStackParamList = {
  Home: undefined;
  Game: undefined;
  CreateGame: undefined;
  HowToPlay: undefined;
  WaitingQueue: undefined;
}

export type homeProps = NativeStackScreenProps<reactStackParamList, 'Home'>;
export type gameProps = NativeStackScreenProps<reactStackParamList, 'Game'>;
export type createGameProps = NativeStackScreenProps<reactStackParamList, 'CreateGame'>;
export type howToPlayProps = NativeStackScreenProps<reactStackParamList, 'HowToPlay'>;
export type waitingQueueProps = NativeStackScreenProps<reactStackParamList, 'WaitingQueue'>;