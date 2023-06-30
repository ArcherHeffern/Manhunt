import React, {useRef, useEffect} from 'react';
import {Animated, Text, View} from 'react-native';
import type {PropsWithChildren} from 'react';
import { Role } from '../../types';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

type FadeInViewProps = PropsWithChildren<{role: Role, duration: number}>;

export default function FadeInView(props: FadeInViewProps, duration: number) {

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration,
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
    </Animated.View>
    </SafeAreaView>
  );
};