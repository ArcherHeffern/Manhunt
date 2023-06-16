import React, { ChangeEvent, useReducer } from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text, TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { createGameProps, formData, actionType, formFields } from '../../types';

const formReducer = (state: formData, action: actionType): formData => {
  return {
    ...state,
    [action.name]: action.value,
  }
}

export default function CreateGame({ route, navigation }: createGameProps) {

  function createGame() {
    navigation.navigate('WaitingQueue');
  }

  const [formData, formDispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const curryDispatch = (name: formFields) => {
    return (text: string) => {
      formDispatch({ name: name, value: text })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the create game page</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder='name'
          keyboardType='ascii-capable'
          onChangeText={curryDispatch(formFields.name)}
        />
        <TextInput
        placeholder='email'
        keyboardType='ascii-capable'
        onChangeText={curryDispatch(formFields.email)}
        />
        <TextInput
        placeholder='password'
        keyboardType='ascii-capable'
        onChangeText={curryDispatch(formFields.password)}
        />
        <TextInput
        placeholder='confirm password'
        keyboardType='ascii-capable'
        onChangeText={curryDispatch(formFields.confirmPassword)}
        />
      </View>
      <Text>FormData: {JSON.stringify(formData)}</Text>
      <Button title='Create Game' onPress={createGame} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  mainCreateGameText: {
    flexGrow: 1,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});