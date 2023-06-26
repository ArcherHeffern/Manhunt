import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { gameProps } from '../../types/';
import styles from './styles';

export default function Game({ route, navigation }: gameProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the game page</Text>
    </SafeAreaView>
  );
}
