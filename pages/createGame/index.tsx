import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';

export default function CreateGame({ navigation }) {

  function createGame() {
    navigator.navigate('WaitingQueue');
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the create game page</Text>
      <Text style={styles.mainCreateGameText}>There will be a lot of inputs here</Text>
      <Button title='Create Game' onPress={CreateGame}/>
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
  }
});