import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './pages/home';
import CreateGame from './pages/createGame';
import WaitingQueue from './pages/waitingQueue';
import Game from './pages/game';
import HowToPlay from './pages/howToPlay';
import { createClient } from '@supabase/supabase-js'

const Stack = createNativeStackNavigator();


const supabaseUrl = 'https://loujtodxdvzommyauzdb.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {

  const [userName, setUserName] = useState('');


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="CreateGame" component={CreateGame} />
        <Stack.Screen name="WaitingQueue" component={WaitingQueue} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="HowToPlay" component={HowToPlay}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
