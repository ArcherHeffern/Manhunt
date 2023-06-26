import React, { useEffect } from 'react';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types/';
import { GameProvider } from './GameProvider';

const Stack = createNativeStackNavigator<reactStackParamList>();

export default function App() {

  useEffect(() => {
    console.log('rerender');
  });

  useEffect(() => {
    console.log('app mounted');
    return () => {
      console.log('app unmounted');
    }
  }, []); // empty array means only run on moun

  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='HowToPlay' component={HowToPlay} />
          <Stack.Screen name='CreateGame' component={CreateGame} />
          <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
          <Stack.Screen name='Game' component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}

