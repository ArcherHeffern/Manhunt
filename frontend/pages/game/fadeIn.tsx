import React, { useRef, useEffect } from 'react';
import { Animated, FlatList, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { Game, Role } from '../../types';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

type FadeInViewProps = PropsWithChildren<{
  role: Role,
  game: Game,
  duration: number
}>;

export default function FadeInView(props: FadeInViewProps) {

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: props.duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View // Special animatable View
        style={[{
          opacity: fadeAnim, // Bind opacity to animated value
        }, styles.fadeIn]}>
        <Text style={styles.fadeInText}>You are a {props.role}</Text>
        <View style={styles.playerListContainer}>
          <View>
        <Text style={styles.playerListContainerTitle}>Runners</Text>
          <FlatList
            data={props.game.runners}
            renderItem={({ item }) => <Text style={styles.playerListContainerItem}>{item.name}</Text>}
          />
          </View>
          <View>
          <Text style={styles.playerListContainerTitle}>Hunters</Text>
          <FlatList
            data={props.game.hunters}
            renderItem={({ item }) => <Text style={styles.playerListContainerItem}>{item.name}</Text>}
          />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};