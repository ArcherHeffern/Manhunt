import React, { useEffect, useContext, useState } from 'react';
import { SafeAreaView, Button, View, Text, FlatList } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { Event, DebugMethod } from '../../types';
import { gameContext } from '../../App';
import styles from './styles';
import { createPlayerJoinListener } from './utils';
import socket from '../../socket';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const [ game, setGame ] = useContext(gameContext);
  console.log(game);

  useEffect(() => {
    console.log(`io id: ${socket.id}`)
    createPlayerJoinListener(socket, setGame);
    socket.on(DebugMethod.SEND_TO_ROOM, (data) => console.log('received send to room', data))
    // @ts-ignore
    console.log('created player join listener')
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
