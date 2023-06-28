import React, { useEffect, useContext } from 'react';
import { SafeAreaView, Text, FlatList, Button, View } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { ServerEvent, ClientEvent } from '../../types';
import { GameContext } from '../../GameProvider';
import styles from './styles';
import { gameQueueBroadcastListener, createGameStartListener, startGame, leaveGame, endGame, createGameEndListener } from './utils';
import socket from '../../socket';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const { game, setGame } = useContext(GameContext);
  const owner = game.players[0].id === socket.id;

  useEffect(() => {
    gameQueueBroadcastListener(socket, setGame);
    createGameStartListener(socket, navigation);
    createGameEndListener(socket, navigation);
    return () => {
      socket.off(ServerEvent.GAME_QUEUE_BROADCAST);
      socket.off(ServerEvent.GAME_START_BROADCAST);
      socket.off(ServerEvent.GAME_END_BROADCAST);
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
        {owner && <Button title='Start Game' onPress={() => startGame(navigation, socket)} />}
        {owner?
          <Button title='End Game' onPress={() => endGame(navigation, socket)} />
          :
          <Button title='Leave Game' onPress={() => leaveGame(navigation, socket)} />  
      }
      </View>
    </SafeAreaView>
  );
}
