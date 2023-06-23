import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { waitingQueueProps } from '../../types/';

export default function WaitingQueue({ route, navigation }: waitingQueueProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the waiting Queue page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});