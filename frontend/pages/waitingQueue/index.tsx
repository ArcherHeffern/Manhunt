import React, { useEffect, useContext } from 'react';
import { SafeAreaView, Text, FlatList, Button, View } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { GameContext } from '../../GameProvider';
import styles from './styles';
import { gameQueueBroadcastListener, createGameStartListener, createStartGameListener, startGame, leaveGame, endGame, createGameEndListener } from './utils';
import socket from '../../socket';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const { game, setGame } = useContext(GameContext);
  const [errormessage, setErrorMessage] = React.useState('');
  const [countdown, setCountdown] = React.useState(0);
  const owner = game.id === socket.id;

  useEffect(() => {
    const unsubscribe1 = gameQueueBroadcastListener(setGame);
    const unsubscribe2 = createGameStartListener(navigation, setCountdown, setGame);
    const unsubscribe3 = createStartGameListener(setErrorMessage);
    const unsubscribe4 = createGameEndListener(navigation);
    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Game ID: {game.id}</Text>
      <Text>Players</Text>
      <FlatList
        data={game.players}
        renderItem={({item}) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />
      <View>
        <Text style={styles.countdown}>{countdown?`Starting in ${countdown}`:''}</Text>
        <Text>{errormessage}</Text>
        {owner && <Button title='Start Game' onPress={() => startGame()} />}
        {owner?
          <Button title='End Game' onPress={() => endGame()} />
          :
          <Button title='Leave Game' onPress={() => leaveGame(navigation)} />  
      }
      </View>
    </SafeAreaView>
  );
}
