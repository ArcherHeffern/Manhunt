import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { waitingQueueProps } from '../../types/';
import { gameContext } from '../../App';
import styles from './styles';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {

  const [ game, setGame ] = React.useContext(gameContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the waiting Queue page</Text>
      <Text>{JSON.stringify(game)}</Text>
    </SafeAreaView>
  );
}
