import { View, Text } from 'react-native';
import { createGameProps } from '../../types/';
import { useContext, useEffect, useState } from 'react';
import { addCreateGameListener } from './utils';
import { getUsernameFromStorage } from '../../common';
import { GameContext } from '../../GameProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateGame({ route, navigation }: createGameProps) {

  const { game, setGame } = useContext(GameContext);
  const [ username, setUsername ] = useState('');
  const [ errormessage, setErrormessage ] = useState('');

  useEffect(() => {
    const unsubscribe = addCreateGameListener(setGame, navigation, setErrormessage);
    getUsernameFromStorage(setUsername);

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView>
      <Text>Choose Gamemode</Text>
      {/* Create options to choose from */}
      {!!errormessage && <Text>Error: {errormessage}</Text>}
    </SafeAreaView>
  )
}