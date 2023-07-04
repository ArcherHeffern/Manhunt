import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SafeAreaView, View, Text, Button } from 'react-native';
import { gameProps, navProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';
import { createGameEndListener, createGameOverListener, createGameTimeListener, createGraceOverListener, createPlayerFoundListener, createPlayerLocationListener, endGameBroadcast } from './utils';
import FadeInView from './fadeIn';
import { Role, GameStatus, LocationMessage } from '../../types';
import GameWinScreen from './GameWinScreen';
import useSensors from './sensorsHook';
import socket from '../../socket';
import ConfirmationModal from './ConfirmationModal';

const duration = 3000;

export default function Game({ route, navigation }: gameProps) {
  const [showContent, setShowContent] = useState(false);
  const { game, setGame } = useContext(GameContext);
  const role = route.params.role
  const { errorMsg, setErrorMsg, location, magnetometerData } = useSensors();
  const { x, y, z } = magnetometerData;
  const [nearestPlayer, setNearestPlayer] = useState<LocationMessage | null>(null);
  const isOwner = game.id === socket.id;
  const [modalVisible, setModalVisible] = useState(false);

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const compassHeading = useMemo(() => {
    if (y > 0) {
      return 90 - Math.atan2(x, y) * (180 / Math.PI);
    } else if (y < 0) {
      return 270 - Math.atan2(x, y) * (180 / Math.PI);
    } else if (y === 0 && x < 0) {
      return 180;
    } else if (y === 0 && x > 0) {
      return 0;
    }
  }, [x, y])

  useEffect(() => {
    const {stopLocationBroadcast, unsubscribe: unsubscribe0 } = createGraceOverListener(location, setGame);
    const unsubscribe1 = createGameEndListener(navigation, setGame, stopLocationBroadcast);
    const unsubscribe2 = createGameOverListener(setGame, navigation, stopLocationBroadcast);
    const unsubscribe3 = createPlayerLocationListener(setNearestPlayer);
    const unsubscribe4 = createPlayerFoundListener(setGame);
    const unsubscribe5 = createGameTimeListener(setGame);
    setTimeout(() => {
      setShowContent(true);
    }, duration * 2);
    return () => {
      unsubscribe0();
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
      unsubscribe5();
    }
  }, [])

  if (!showContent) {
    return (
      <FadeInView role={role} duration={duration} game={game} />
    )
  } else if (game.winner) {
    return (
      <GameWinScreen {...{ navigation }} />
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
          <Text>Math stuff: {compassHeading}</Text>
          <View>
            <Text>Location:</Text>
            <Text>My Latitude: {location?.coords?.latitude || 0}</Text>
            <Text>My Longitude: {location?.coords?.longitude || 0}</Text>
            <Text>Other Latitude: {nearestPlayer.latitude || 0}</Text>
            <Text>Other Longitude: {nearestPlayer.longitude || 0}</Text>
          </View>
          <View>
            <Button title='I have been found!' onPress={() => { openModal(); }}/>
            <ConfirmationModal modalVisible={modalVisible} closeModal={closeModal} navigation={navigation}/>
          </View>
        </View>
        <Text>Tracker resets in {5} seconds</Text>
        {game.found.length !== 0 && (<Text>{game.found[game.found.length - 1].name} was last found</Text>)}
        <Text>Objective: {role === Role.HUNTER ? 'Run from the Hunters' : 'Find the Runners'}</Text>
        <Text>{game.runners.length - game.found.length}/{game.runners.length} Runners remaining</Text>
        <Text>{game.status === GameStatus.GRACE?`Grace time left ${game.grace}`:`Game time left ${game.time}`}</Text>
        {isOwner && <Button title="End Game" onPress={() => { endGameBroadcast(); }} />}
        {errorMsg && <Text>Error: {errorMsg}</Text>}
      </SafeAreaView>
    );
  }
}
