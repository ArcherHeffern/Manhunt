import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, Button, View, Text } from 'react-native';
import { homeProps } from '../../types/';
import JoinGameModal from './joinGameModal';
import styles from './styles';
import socket from '../../socket';
import { ClientEvent } from '../../types';
import { GameContext } from '../../GameProvider';

export default function Home({ route, navigation }: homeProps) {

  const [showModal, setShowModal] = useState(false);
  const {game, setGame} = useContext(GameContext);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <JoinGameModal {...{showModal, closeModal, navigation}} />
      <Text style={styles.header}> ManHunt </Text>
      <View style={styles.mainPageButtonContainer} >
        <Button title='Join Game' onPress={() => openModal()} />
        <Button title='Create Game' onPress={() => navigation.navigate("CreateGame")} />
        <Button title='How to Play' onPress={() => navigation.navigate('HowToPlay')} />
      </View >
      <View>
        <Text>Advertisement</Text>
      </View>
    </SafeAreaView>
  );
}
