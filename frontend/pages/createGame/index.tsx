import React, { useReducer, useContext } from 'react';
import { SafeAreaView, Button, View, Text, TextInput } from 'react-native';
import { createGameProps, formData, actionType, formFields } from '../../types/';
import { connectionContext, gameContext } from '../../App';
import { curryDispatch, createGame } from './utils';
import styles from './styles';

const formReducer = (state: formData, action: actionType): formData => {
  return {
    ...state,
    [action.name]: action.value,
  }
}

export default function CreateGame({ route, navigation }: createGameProps) {

  // state 

  const [formData, formDispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const io = useContext(connectionContext);
  const [game, setGame] = useContext(gameContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the create game page</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder='name'
          keyboardType='ascii-capable'
          onChangeText={curryDispatch(formFields.name, formDispatch)}
        />
        <TextInput
          placeholder='email'
          keyboardType='ascii-capable'
          onChangeText={curryDispatch(formFields.email, formDispatch)}
        />
        <TextInput
          placeholder='password'
          keyboardType='ascii-capable'
          onChangeText={curryDispatch(formFields.password, formDispatch)}
        />
        <TextInput
          placeholder='confirm password'
          keyboardType='ascii-capable'
          onChangeText={curryDispatch(formFields.confirmPassword, formDispatch)}
        />
      </View>
      <Text>FormData: {JSON.stringify(formData)}</Text>
      <Button title='Create Game' onPress={() => createGame(io, formData, setGame, navigation)} />
    </SafeAreaView>
  );
}
