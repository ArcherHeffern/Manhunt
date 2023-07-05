import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SafeAreaView, View, Text, Button } from 'react-native';
import { gameProps } from '../../types/';
import styles from './styles';
import { GameContext } from '../../GameProvider';
import { createGameEndListener, createGameOverListener, createGameTimeListener, createGraceOverListener, createPlayerFoundListener, createPlayerLocationListener, createTimeUntilLocationUpdateListener, endGameBroadcast, useCompassHeading, leaveGame } from './utils';
import FadeInView from './fadeIn';
import { Role, GameStatus, ServerLocationMessage, Location, Player, ClientEvent, ClientLocationMessage } from '../../types';
import useSensors from './sensorsHook';
import socket from '../../socket';
import ConfirmationModal from './ConfirmationModal';
import GraceOverModal from './graceOverModal';

const duration = 3000;

export default function Game({ route, navigation }: gameProps) {
  const [showContent, setShowContent] = useState(false);
  const { game, setGame } = useContext(GameContext);
  const role = route.params.role
  const { errorMsg, location, magnetometerData } = useSensors();
  const { x, y, z } = magnetometerData;
  const [nearestPlayer, setNearestPlayer] = useState<ServerLocationMessage | null>(null);
  const isOwner = game.id === socket.id;
  const [modalVisible, setModalVisible] = useState(false);
  const compassHeading = useCompassHeading(x, y);
  const [graceOverModalVisible, setGraceOverModalVisible] = useState(false);
  const [timeUntilLocationUpdate, setTimeUntilLocationUpdate] = useState(role === Role.HUNTER?game.settings.hunterInterval:game.settings.runnerInterval);

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

  // updates location when location updates
  // sends location when location updates and game is running
  useEffect(() => {
    setGame((game) => {
      return {
        ...game,
        players: game.players.map((player) => {
          if (player.id === socket.id) {
            return {
              ...player,
              location: {
                lat: location?.coords?.latitude,
                lng: location?.coords?.longitude,
              } as Location
            } as Player;
          }
          return player;
        })
      }
    })
    let sendLocationInterval: NodeJS.Timeout;
    const broadcast: ClientLocationMessage = {
      gameId: game.id,
      player: game.players.filter((player) => player.id === socket.id)[0],
    }
    socket.emit(ClientEvent.PLAYER_LOCATION_MESSAGE, broadcast);
    if (game.status === GameStatus.RUNNING) {
      sendLocationInterval = setInterval(() => {
        console.log('sending location: ' + JSON.stringify(location))
        const broadcast: ClientLocationMessage = {
          gameId: game.id,
          player: game.players.filter((player) => player.id === socket.id)[0],
        }
        socket.emit(ClientEvent.PLAYER_LOCATION_MESSAGE, broadcast);
      }, 1000);
      return () => { clearInterval(sendLocationInterval); }
    }
  }, [location])

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
        <Text>Magnetometer:</Text>
        <Text>x: {x}</Text>
        <Text>y: {y}</Text>
        <Text>z: {z}</Text>
        <Text>Math stuff: {compassHeading}</Text>
        <View style={styles.body}>
          <Text>Location:</Text>
          <Text>My Latitude: {location?.coords?.latitude || 0}</Text>
          <Text>My Longitude: {location?.coords?.longitude || 0}</Text>
          <Text>Other Latitude: {nearestPlayer?.player?.location?.lat || 0}</Text>
          <Text>Other Longitude: {nearestPlayer?.player?.location?.lng || 0}</Text>
        </View>
        {game.status === GameStatus.RUNNING && role === Role.RUNNER &&
            <Button title='I have been found!' onPress={() => { openModal(); }} />
        }
        <Text>Tracker resets in {timeUntilLocationUpdate} seconds</Text>
        {game.found.length !== 0 && (<Text>{game.found[game.found.length - 1]?.name} was last found</Text>)}
        <Text>{game.runners.length - game.found.length}/{game.runners.length} Runners remaining</Text>
        <Text>{game.status === GameStatus.GRACE ? `Grace time left ${game.grace}` : `Game time left ${game.time}`}</Text>
        {isOwner && <Button title="End Game" onPress={() => { endGameBroadcast(navigation); }} />}
        {errorMsg && <Text>Error: {errorMsg}</Text>}
        { !isOwner && <Button title='Leave Game' onPress={() => {leaveGame(navigation)}}/> } 
        <ConfirmationModal modalVisible={modalVisible} closeModal={closeModal} navigation={navigation} />
        <GraceOverModal modalVisible={graceOverModalVisible} closeModal={closeGraceOverModal}/>
      </SafeAreaView>
    );
  }
}
