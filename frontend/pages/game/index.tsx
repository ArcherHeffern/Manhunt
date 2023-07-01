import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { gameProps, navProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';
import { createGameEndListener, createGameOverListener, createGraceOverListener, createPlayerFoundListener, createPlayerLocationListener } from './utils';
import FadeInView from './fadeIn';
import { Role } from '../../types';
import GameWinScreen from './GameWinScreen';
import { Gyroscope } from 'expo-sensors';

const duration = 3000;

export default function Game({ route, navigation }: gameProps) {
  const [{ x, y, z }, setData] = useState({
      x: 0,
      y: 0,
      z: 0,
    });
  const [showContent, setShowContent] = useState(false);
  const { game, setGame } = useContext(GameContext);
  const role = route.params.role;
  const oppositeRole = role === Role.HUNTER ? Role.RUNNER : Role.HUNTER;

  useEffect(() => {
    const unsubscribe1 = createGameEndListener(navigation);
    const unsubscribe2 = createGameOverListener(setGame);
    const unsubscribe3 = createPlayerLocationListener();
    const unsubscribe4 = createPlayerFoundListener(setGame);
    createGraceOverListener();
    setTimeout(() => {
      setShowContent(true);
    }, duration * 2);
    return () => {
      unsubscribe1();
    }
  }, [])

  const [subscription, setSubscription] = useState(null);

  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  if (!showContent) {
    return (
      <FadeInView role={role} duration={duration} game={game}/>
    )
  } else if (game.winner) {
    return (
      <GameWinScreen {...{navigation}}/>
    )
  } else {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>You are {role}</Text>
      <View>
        <Text>Gyroscope:</Text>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <View>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
        {/* This is for the compass to the nearest player */}
      </View>
      <Text>Tracker resets in {5} seconds</Text>
      {game.found.length !== 0 && (<Text>{game.found[game.found.length - 1].name} was last found</Text>)}
      <Text>Objective: {role === Role.HUNTER? 'Run from the Hunters': 'Find the Runners'}</Text>
      <Text>{game.runners.length - game.found.length}/{game.runners.length} Runners remaining</Text>
    </SafeAreaView>
  );
  }
}
