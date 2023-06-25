import React, { useState } from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { homeProps } from '../../types/';
import JoinGameModal from './joinGameModal';
import styles from './styles';

export default function Home({ route, navigation }: homeProps) {

  const [showModal, setShowModal] = useState(false);

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
        <Text>Advertisement </Text>
      </View>
    </SafeAreaView>
  );
}
