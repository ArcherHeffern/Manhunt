import React, { useContext, useEffect, useReducer, useState } from 'react';
import { SafeAreaView, Button, View, Text, TextInput, Switch, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { actionType, createGameSettingsProps } from '../../types/';
import { GameSettings, GameModeSettings  } from '../../types'
import { createGameEmitter, addCreateGameListener } from '../createGame/utils';
import { getUsernameFromStorage, setUsernameInStorage } from '../../common';
import styles from './styles';
import { toGameSettings } from '../createGame/gameModes';
import NumericInputWrapper from '../createGame/NumericInputWrapper';
import ToggleWrapper from '../createGame/toggleWrapper';
import { GameContext } from '../../GameProvider';


const formReducer = (state: GameModeSettings, action: actionType): GameModeSettings => {
  return {
    ...state,
    [action.name]: [action.value, true],
  }
}

export default function GameMode({ route, navigation}: createGameSettingsProps) {

  const {gameModeSettings } = route.params;
  const { game, setGame } = useContext(GameContext);
  const [username, setUsername] = useState('');
  const [errormessage, setErrorMessage] = useState('');

  const [formData, formDispatch] = useReducer(formReducer, gameModeSettings);

  useEffect(() => {
    navigation.setOptions({ title: gameModeSettings.name });
    const unsubscribe = addCreateGameListener(setGame, navigation, setErrorMessage);
    getUsernameFromStorage(setUsername);

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={styles.container}>
          <Text style={styles.textContent}>{gameModeSettings.description}</Text>
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
              {
                // Shitty fix (key !== description, might need to fix later)
                Object.keys(formData).map((key: keyof GameModeSettings) => {
                  const values = formData[key];
                  if (!values[1]) {
                    return null;
                  }
                  if (typeof values[0] === 'boolean' && key !== 'description' && key !== 'name') {
                    return (
                      <ToggleWrapper key={key} name={key} value={values[0]} formDispatch={formDispatch} />
                    )
                  } else if (typeof values[0] === 'number' && key !== 'description' && key !== 'name') {
                    return (
                      <NumericInputWrapper key={key} name={key} value={values[0]} formDispatch={formDispatch} />
                    )
                  }
                  return null;
                })
              }
          <Button title='Create Game' onPress={() => {
            createGameEmitter(toGameSettings(formData), username, setErrorMessage);
            setUsernameInStorage(username);
          }
          } />
        </View>
        {!!errormessage && <Text>Error: {errormessage}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
