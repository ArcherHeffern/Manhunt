import React, { useState, useContext } from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { gameProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';

export default function Game({ route, navigation }: gameProps) {

  const role = route.params.role;

  const { game, setGame } = useContext(GameContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the game page</Text>
      <Text>You are a {role}</Text>
    </SafeAreaView>
  );
}
