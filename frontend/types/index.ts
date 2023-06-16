import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';

export type reactStackParamList = {
  Home: undefined;
  Game: {userReference: FirebaseDatabaseTypes.Reference, gameReference: FirebaseDatabaseTypes.Reference, user: FirebaseAuthTypes.User};
  CreateGame: undefined;
  HowToPlay: undefined;
  WaitingQueue: { gameReference: FirebaseDatabaseTypes.Reference}; // we need to be connected to game before we route to this page    const theme = useContext(ThemeContext);
}

export type homeProps = NativeStackScreenProps<reactStackParamList, 'Home'>;
export type gameProps = NativeStackScreenProps<reactStackParamList, 'Game'>;
export type createGameProps = NativeStackScreenProps<reactStackParamList, 'CreateGame'>;
export type howToPlayProps = NativeStackScreenProps<reactStackParamList, 'HowToPlay'>;
export type waitingQueueProps = NativeStackScreenProps<reactStackParamList, 'WaitingQueue'>;

export enum formFields {
  name = 'name',
  email = 'email',
  password = 'password',
  confirmPassword = 'confirmPassword'
}
export type formData = {
  [formFields.name]: string;
  [formFields.email]: string;
  [formFields.password]: string;
  [formFields.confirmPassword]: string;
}

export type actionType = {
  name: formFields,
  value: string,
}