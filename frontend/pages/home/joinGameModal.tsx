import React, { useState, useContext, useEffect } from 'react';
import { gameContext } from '../../App';
import socket from '../../socket';
import { Button, View, Text, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './styles';
import { joinGameEmitter, addJoinGameListener } from './utils';
import { getUsernameFromStorage, setUsernameInStorage } from '../../common';

interface Props {
    showModal: boolean;
    closeModal: () => void;
    navigation: any;
}

export default function JoinGameModal({ showModal, closeModal, navigation }: Props) {

  const [gameCode, setGameCode] = useState('');
  const [username, setUsername] = useState('');
  const [errormessage, setErrorMessage] = useState(''); 
  const [_, setGame] = useContext(gameContext);

  useEffect(() => {
        addJoinGameListener(navigation, socket, setGame, setErrorMessage, closeModal);
        getUsernameFromStorage(setUsername);
    }, []);

    return ( showModal &&
      <Modal
        visible={showModal}
        onRequestClose={() => closeModal()}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Enter Game Code</Text>
              <TextInput
              placeholder='Game Code'
              keyboardType='ascii-capable'
              autoCapitalize='characters'
              onChangeText={setGameCode}
              // onPress={(e) => {e.stopPropagation();}}
              value={gameCode}
              style={styles.textInput}
              />
              <Text>Username</Text>
          <TextInput
            placeholder={username}
            onChangeText={(val) => {
              setUsername(val);
            }}
          />
              <Text>{errormessage}</Text>
              <Button
              disabled={!gameCode}
              title='Join Game'
              onPress={() => {
                joinGameEmitter(socket, gameCode, username);
                setUsernameInStorage(username);
                }} />
              <Button title='Cancel' onPress={() => closeModal()} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
}