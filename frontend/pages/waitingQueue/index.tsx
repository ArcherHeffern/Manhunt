import React, { useEffect, useContext } from 'react';
import { SafeAreaView, Text, FlatList } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { ServerEvent } from '../../types';
import { gameContext } from '../../App';
import styles from './styles';
import { createPlayerJoinListener } from './utils';
import socket from '../../socket';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const [ game, setGame ] = useContext(gameContext);

  useEffect(() => {
    createPlayerJoinListener(socket, setGame);
    // createPlayerLeaveListener(io, setGame);
    // createGameStartListener(io, setGame);
    return () => {
      socket.off(ServerEvent.GAME_QUEUE_BROADCAST);
      // socket.off(Event.PLAYER_LEAVE);
      // socket.off(Event.GAME_START);
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
    </SafeAreaView>
  );
}
