import React, { useEffect } from 'react';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame/';
import CreateGameSettings from './pages/createGameSettings';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import GameDone from './pages/gameDone';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types/';
import { GameProvider } from './GameProvider';

const Stack = createNativeStackNavigator<reactStackParamList>();

export default function App() {

  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
          <Stack.Screen name='Home' component={Home} options={{headerShown: true}}/>
          <Stack.Screen name='HowToPlay' component={HowToPlay} options={{headerShown: true}}/>
          <Stack.Screen name='CreateGame' component={CreateGame} options={{headerShown: true}}/>
          <Stack.Screen name='CreateGameSettings' component={CreateGameSettings} options={{headerShown: true}}/>
          <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
          <Stack.Screen name='Game' component={Game} />
          <Stack.Screen name='GameDone' component={GameDone} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}

