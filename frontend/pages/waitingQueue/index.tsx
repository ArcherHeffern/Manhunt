import React, { useEffect, useContext, useState } from 'react';
import { SafeAreaView, Button, View, Text, FlatList } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { gameContext, connectionContext } from '../../App';
import styles from './styles';
import { createPlayerJoinListener } from './utils';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const [ game, setGame ] = useContext(gameContext);
  const io = useContext(connectionContext);
  console.log(game);

  useEffect(() => {
    createPlayerJoinListener(io, setGame);
    // createPlayerLeaveListener(io, setGame);
    // createGameStartListener(io, setGame);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the waiting Queue page</Text>
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
