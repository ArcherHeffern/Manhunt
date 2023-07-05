import React, { useReducer, useContext, useEffect, useState } from 'react';
import { SafeAreaView, Button, View, Text, TextInput, Switch } from 'react-native';
import { createGameProps, actionType } from '../../types/';
import { GameSettings } from '../../types'
import { GameContext } from '../../GameProvider';
import { createGameEmitter, addCreateGameListener } from './utils';
import { getUsernameFromStorage, setUsernameInStorage } from '../../common';
import styles from './styles';

const initialFormData: GameSettings = {
  maxPlayers: 5,
  numHunters: 1,
  maxRounds: 1,
  maxTime: 120,
  hunterInterval: 10,
  runnerInterval: 20,
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
  const {game, setGame} = useContext(GameContext);
  const [errormessage, setErrormessage] = useState('');

  useEffect(() => {
    const unsubscribe = addCreateGameListener(setGame, navigation, setErrormessage);
    getUsernameFromStorage(setUsername);

    return () => {
      unsubscribe();
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
            style={styles.field}
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
            style={styles.field}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Tracker coolDown (hunter)</Text>
          <TextInput
            placeholder={formData.hunterInterval.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'hunterInterval', value: parseInt(val) });
            }}
            style={styles.field}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Tracker coolDown (runner)</Text>
          <TextInput
            placeholder={formData.runnerInterval.toString()}
            keyboardType='numeric'
            onChangeText={(val) => {
              formDispatch({ name: 'runnerInterval', value: parseInt(val) });
            }}
            style={styles.field}
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
            style={styles.field}
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
            style={styles.field}
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
            style={styles.field}
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
            style={styles.field}
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
      {!!errormessage && <Text>Error: {errormessage}</Text> } 
      <Button title='Create Game' onPress={() => {
        createGameEmitter(formData, username, setErrormessage);
        setUsernameInStorage(username);
      }
      } />
    </SafeAreaView>
  );
}
