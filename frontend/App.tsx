import React, { createContext, useEffect } from 'react';
import { Game as _Game } from './types';
import { GameContextValue } from './types/';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types/';
import socket from './socket';

export const gameContext = createContext<GameContextValue|null>(null);
const Stack = createNativeStackNavigator<reactStackParamList>();

export default function App() {

  const [game, setGame] = React.useState<_Game>(null);

  return (
    <gameContext.Provider value={[game, setGame]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='HowToPlay' component={HowToPlay} />
          <Stack.Screen name='CreateGame' component={CreateGame} />
          <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
          <Stack.Screen name='Game' component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    </gameContext.Provider>
  );
}

