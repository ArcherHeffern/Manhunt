import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { gameProps } from '../../types/';

export default function Game({ route, navigation }: gameProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the game page</Text>
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