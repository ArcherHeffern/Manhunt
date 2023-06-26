import React, { useReducer, useContext, useEffect, useState } from 'react';
import { SafeAreaView, Button, View, Text, TextInput, Switch } from 'react-native';
import { createGameProps, actionType } from '../../types/';
import { GameSettings, ServerEvent } from '../../types'
import { gameContext } from '../../App';
import socket from '../../socket';
import { createGameEmitter, addCreateGameListener } from './utils';
import { getUsernameFromStorage, setUsernameInStorage } from '../../common';
import styles from './styles';

const initialFormData: GameSettings = {
  maxPlayers: 5,
  numHunters: 1,
  maxRounds: 1,
  maxTime: 120,
  gracePeriod: 60,
  showDistance: false,
  hotCold: false,
};

const formReducer = (state: GameSettings, action: actionType): GameSettings => {
  return {
    ...state,
    [action.name]: action.value || initialFormData[action.name],
  }
}

export default function CreateGame({ route, navigation }: createGameProps) {

  const [formData, formDispatch] = useReducer(formReducer, initialFormData);
  const [username, setUsername] = useState('');
  const [_, setGame] = useContext(gameContext);

  useEffect(() => {
    addCreateGameListener(socket, setGame, navigation);
    getUsernameFromStorage(setUsername);

    return () => {
      socket.off(ServerEvent.CREATE_GAME_RESPONSE);
    }
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <Text>Create Game</Text>
      <View style={styles.formContainer}>
        <View style={styles.fieldContainer}>
          <Text>Username</Text>
          <TextInput
            placeholder={username}
            onChangeText={(val) => {
              setUsername(val);
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Max Players</Text>
          <TextInput
            placeholder={formData.maxPlayers.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'maxPlayers', value: parseInt(val) });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Number of Hunters</Text>
          <TextInput
            placeholder={formData.numHunters.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'numHunters', value: parseInt(val) });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Max Rounds</Text>
          <TextInput
            placeholder={formData.maxRounds.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'maxRounds', value: parseInt(val) });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Max Time</Text>
          <TextInput
            placeholder={formData.maxTime.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'maxTime', value: parseInt(val) });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Grace Period</Text>
          <TextInput
            placeholder={formData.gracePeriod.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'gracePeriod', value: parseInt(val) });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Show Distance</Text>
          <Switch
            value={formData.showDistance}
            onValueChange={(val) => {
              formDispatch({ name: 'showDistance', value: val });
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Hot Cold</Text>
          <Switch
            value={formData.hotCold}
            onValueChange={(val) => {
              formDispatch({ name: 'hotCold', value: val });
            }}
          />
        </View>
      </View>
      <Text>FormData: {JSON.stringify(formData)}</Text>
      <Button title='Create Game' onPress={() => {
        createGameEmitter(socket, formData, username)
        setUsernameInStorage(username);
      }
      } />
    </SafeAreaView>
  );
}
