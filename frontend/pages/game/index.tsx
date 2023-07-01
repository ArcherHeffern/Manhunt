import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { gameProps, navProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';
import { createGameEndListener, createGameOverListener, createGraceOverListener, createPlayerFoundListener, createPlayerLocationListener } from './utils';
import FadeInView from './fadeIn';
import { Role } from '../../types';
import GameWinScreen from './GameWinScreen';
import useSensors from './sensorsHook';

const duration = 3000;

export default function Game({ route, navigation }: gameProps) {
  const [showContent, setShowContent] = useState(false);
  const { game, setGame } = useContext(GameContext);
  const role = route.params.role
  const { errorMsg, location, magnetometerData } = useSensors();
  const { x, y, z } = magnetometerData;

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
        <Text>Magnetometer:</Text>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <View>
        <Text>Location:</Text>
        <Text>Latitude: {location?.coords?.latitude || 0}</Text>   
        <Text>Longitude: {location?.coords?.longitude || 0}</Text>
      </View>
        {/* This is for the compass to the nearest player */}
      </View>
      <Text>Tracker resets in {5} seconds</Text>
      {game.found.length !== 0 && (<Text>{game.found[game.found.length - 1].name} was last found</Text>)}
      <Text>Objective: {role === Role.HUNTER? 'Run from the Hunters': 'Find the Runners'}</Text>
      <Text>{game.runners.length - game.found.length}/{game.runners.length} Runners remaining</Text>
      {errorMsg && <Text>Error: {errorMsg}</Text>}
    </SafeAreaView>
  );
  }
}
