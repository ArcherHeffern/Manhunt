import React from 'react';
import { SafeAreaView, Button, View, StyleSheet, Text } from 'react-native';
import { howToPlayProps } from '../../types/';

export default function HowToPlay({ route, navigation }: howToPlayProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>How to Play</Text>
      <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quod quisquam eius esse sequi voluptate dolore consequuntur, ad adipisci fugiat suscipit nesciunt molestiae recusandae doloribus quis rerum cupiditate nihil velit id est inventore in commodi. Quam, exercitationem, iste facere vitae odio assumenda animi optio sint eum amet impedit et facilis.</Text>
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
  }
});