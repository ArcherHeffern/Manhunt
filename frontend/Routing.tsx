import React, { useEffect, useContext } from 'react';
import Home from './pages/home';
import Game from './pages/game';
import CreateGame from './pages/createGame';
import HowToPlay from './pages/howToPlay';
import WaitingQueue from './pages/waitingQueue';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactStackParamList } from './types/';
import { Event } from './types';
import { connectionContext } from './App';

const Stack = createNativeStackNavigator<reactStackParamList>();
export default function Routing() {

  const io = useContext(connectionContext);

  useEffect(() => {
    if (!io) {
      console.log("not connected to the server")
      return;
    }
    console.log("connected to the server")
    io.on(Event.GENERAL, (data: any) => {
      console.log('data from server: under the general event', data);
    })

    io.on(Event.GAME, (data: any) => {
      console.log('data from server: under the game event', data);
    })

    io.on(Event.HUNTER, (data: any) => {
      console.log('data from server: under the hunter event', data);
    })

    io.on(Event.RUNNER, (data: any) => {
      console.log('data from server: under the runner event', data);
    })
  }, [io])
  return <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='HowToPlay' component={HowToPlay} />
        <Stack.Screen name='CreateGame' component={CreateGame} />
        <Stack.Screen name='WaitingQueue' component={WaitingQueue} />
        <Stack.Screen name='Game' component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  </>
}