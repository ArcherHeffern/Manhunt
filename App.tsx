import React from 'react';
import { StyleSheet } from 'react-native/types';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Game' component={Game} />
        <Stack.Screen name='CreateGame' component={CreateGame} />
        <Stack.Screen name='HowToPlay' component={HowToPlay} />
        <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
