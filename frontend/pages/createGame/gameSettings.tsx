import React, { useReducer, useContext, useEffect, useState } from 'react';
import { SafeAreaView, Button, View, Text, TextInput, Switch, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createGameProps, actionType } from '../../types/';
import { GameSettings, GameModeSettings  } from '../../types'
import { GameContext } from '../../GameProvider';
import { createGameEmitter, addCreateGameListener } from './utils';
import { getUsernameFromStorage, setUsernameInStorage } from '../../common';
import styles from './styles';
import { toGameSettings } from './gameModes';
import NumericInputWrapper from './NumericInputWrapper';
import ToggleWrapper from './toggleWrapper';


const formReducer = (state: GameModeSettings, action: actionType): GameModeSettings => {
  return {
    ...state,
    [action.name]: [...action.value]
  }
}

export default function CreateGame(gameModeSettings: GameModeSettings, username: string, setUsername: React.Dispatch<React.SetStateAction<string>>, setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {

  const [formData, formDispatch] = useReducer(formReducer, gameModeSettings);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Game</Text>
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
                Object.keys(formData).map((key: keyof GameModeSettings) => {
                  const values = formData[key];
                  if (!values[1]) {
                    return null;
                  }
                  if (typeof values[0] === 'boolean') {
                    return (
                      <ToggleWrapper key={key} name={key} value={values[0]} formDispatch={formDispatch} />
                    )
                  } else if (typeof values[0] === 'number') {
                    return (
                      <NumericInputWrapper key={key} name={key} value={values[0]} formDispatch={formDispatch} />
                    )
                  }
                  return null;
                })
              }
          <Button title='Create Game' onPress={() => {
            createGameEmitter(toGameSettings(formData), username, setErrormessage);
            setUsernameInStorage(username);
          }
          } />
        </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
