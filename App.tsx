import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/home';
import CreateGame from './pages/createGame';
import WaitingQueue from './pages/waitingQueue';
import Game from './pages/game';
import HowToPlay from './pages/howToPlay';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();


export default function App() {

  const [user, setUser] = useState<FirebaseAuthTypes.User|null>(null);

  const [initializing, setInitializing] = useState(true);

  auth().onAuthStateChanged((user) => {
    console.log(`User: ${user}`);
    if (user) {
      // user logged in
      setUser(user);
    } else {
      // user logged out
    }
  });

  auth().signInAnonymously();

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateGame" component={CreateGame} />
        <Stack.Screen name="WaitingQueue" component={WaitingQueue} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="HowToPlay" component={HowToPlay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
