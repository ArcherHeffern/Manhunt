import React from 'react';
import { StyleSheet } from 'react-native/types';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types';

const Stack = createNativeStackNavigator<reactStackParamList>();

// export const gameContextProvider = React.createContext<FirebaseDatabaseTypes.Reference|null>(null);
// export const userContextProvider = React.createContext<FirebaseAuthTypes.User|null>(null);

// export const userReferenceContextProvider = React.createContext<FirebaseDatabaseTypes.Reference|null>(null);

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='HowToPlay' component={HowToPlay} />
        <Stack.Screen name='CreateGame' component={CreateGame} />
        <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
        <Stack.Screen name='Game' component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
