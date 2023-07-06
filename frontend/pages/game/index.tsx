import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, Button } from 'react-native';
import { gameProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';
import { createGameEndListener, createGameOverListener, createGameTimeListener, createGraceOverListener, createPlayerFoundListener, createPlayerLocationListener, createTimeUntilLocationUpdateListener, endGameBroadcast, leaveGame } from './utils';
import FadeInView from './fadeIn';
import { Role, GameStatus, ServerLocationMessage, Location, Player, ClientEvent, ClientLocationMessage } from '../../types';
import socket from '../../socket';
import useSensors from './sensorsHook';
import ConfirmationModal from './ConfirmationModal';
import GraceOverModal from './graceOverModal';
import Compass from './Compass';
import sendLocation from './sendLocation';

const duration = 3000;

export default function Game({ route, navigation }: gameProps) {
  const [showContent, setShowContent] = useState(false);
  const { game, setGame } = useContext(GameContext);
  const [nearestPlayer, setNearestPlayer] = useState<ServerLocationMessage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [graceOverModalVisible, setGraceOverModalVisible] = useState(false);
  const [timeUntilLocationUpdate, setTimeUntilLocationUpdate] = useState(route.params.role === Role.HUNTER ? game.settings.hunterInterval : game.settings.runnerInterval);
  
  const role = route.params.role
  const isOwner = game.id === socket.id;

  function openGraceOverModal() {
    setGraceOverModalVisible(true);
  }

  function closeGraceOverModal() {
    setGraceOverModalVisible(false);
  }

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const { location, errorMsg } = sendLocation(game, setGame);

  useEffect(() => {
    console.log('game page mounted');
    const unsubscribe0 = createGraceOverListener(setGame, game, openGraceOverModal);
    const unsubscribe1 = createGameEndListener(navigation, setGame);
    const unsubscribe2 = createGameOverListener(setGame, navigation);
    const unsubscribe3 = createPlayerLocationListener(setNearestPlayer);
    const unsubscribe4 = createPlayerFoundListener(setGame);
    const unsubscribe5 = createGameTimeListener(setGame);
    const unsubscribe6 = createTimeUntilLocationUpdateListener(setTimeUntilLocationUpdate);
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
      unsubscribe6();
      console.log('game page unmounted');
    }
  }, [])

  if (!showContent) {
    return (
      <FadeInView role={role} duration={duration} game={game} />
    )
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>You are a {role}</Text>
        <Text>Objective: {role === Role.RUNNER ? 'Run from the Hunters' : 'Find the Runners'}</Text>
        <View style={styles.body}>
          {game.status === GameStatus.GRACE ? (
            // Countdown to grace over
            <>
              <Text style={styles.title}>Grace period ends in {game.grace} seconds</Text>
            </>
          ) : (
            // Game is running - tracker
            <>
              <Compass nearestPlayer={nearestPlayer} location={location} />
            </>
          )}
          {!!errorMsg && <Text>{errorMsg}</Text>}
        </View>
        {game.status === GameStatus.RUNNING && role === Role.RUNNER &&
          <Button title='I have been found!' onPress={() => { openModal(); }} />
        }
        { game.status === GameStatus.RUNNING && <Text>Tracker resets in {timeUntilLocationUpdate} seconds</Text> }
        { game.found.length !== 0 && (<Text>{game.found[game.found.length - 1]?.name} was last found</Text>) }
        <Text>{game.runners.length - game.found.length}/{game.runners.length} Runners remaining</Text>
        { game.status === GameStatus.RUNNING && <Text>Game time left: {game.time} seconds</Text> }
        { isOwner && <Button title="End Game" onPress={() => { endGameBroadcast(navigation); }} /> }
        { !isOwner && <Button title='Leave Game' onPress={() => { leaveGame(navigation) }} /> }
        <ConfirmationModal modalVisible={modalVisible} closeModal={closeModal} navigation={navigation} />
        <GraceOverModal modalVisible={ graceOverModalVisible } closeModal={ closeGraceOverModal } />
      </SafeAreaView>
    );
  }
}
