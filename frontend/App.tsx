import React, { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types/';
import { Game as _Game, Event } from './types';
import { GameContextValue } from './types/';

export const connectionContext = createContext<Socket>(null); 
export const gameContext = createContext<GameContextValue>(null);

const Stack = createNativeStackNavigator<reactStackParamList>();

export default function App() {

  const _io = useContext(connectionContext);
  //! _io is null and giving a null exception when running

  const [game, setGame] = React.useState<_Game>(null);

  //! need to run all these exactly once 
  _io.on(Event.GENERAL, (data: any) => {
    console.log('data from server: under the message event', data);
  })

  _io.on(Event.GAME, (data: any) => {
    console.log('data from server: under the game event', data);
  })

  _io.on(Event.HUNTER, (data: any) => {
    console.log('data from server: under the hunter event', data);
  })

  _io.on(Event.RUNNER, (data: any) => {
    console.log('data from server: under the runner event', data);
  })

  return (
    <gameContext.Provider value={[game, setGame]}>
      <connectionContext.Provider value={io('http://localhost:3000')}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='HowToPlay' component={HowToPlay} />
            <Stack.Screen name='CreateGame' component={CreateGame} />
            <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
            <Stack.Screen name='Game' component={Game} />
          </Stack.Navigator>
        </NavigationContainer>
      </connectionContext.Provider>
    </gameContext.Provider>
  );
}
