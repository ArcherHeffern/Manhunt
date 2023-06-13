import React, { useState } from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import app from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const Auth = auth();

export default function Home({ navigation }) {

  const [user, setUser] = React.useState<FirebaseAuthTypes.User|null>(null);

  Auth.onAuthStateChanged(user => {
    console.log(user)
    if (user) {
      // user logged in
      setUser(user);
      console.log('User signed in anonymously');
    }
  });

Auth.signInAnonymously();

  const [showModal, setShowModal] = useState(false);
  const [gameCode, setGameCode] = useState('');

  function navigateToWaitingQueue() {
    navigation.navigate("WaitingQueue");
  }
  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setGameCode('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>{user?"Logged In": "Logged Out"}</Text>
      <Modal
        visible={showModal}
        onRequestClose={() => closeModal()}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Enter Game Code</Text>
              <TextInput placeholder='Game Code' keyboardType='ascii-capable' onChangeText={setGameCode} value={gameCode} style={styles.textInput} />
              <Button disabled={!gameCode} title='Join Game' onPress={() => {
                closeModal();
                navigateToWaitingQueue();
              }} />
              <Button title='Cancel' onPress={() => closeModal()} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  header: {
    fontSize: 20,
  },
  mainPageButtonContainer: {
    flexGrow: 1
  },
  textInput: {
    height: 40,
    width: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});