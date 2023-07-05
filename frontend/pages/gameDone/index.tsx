import React, { useContext } from 'react';
import { GameContext } from '../../GameProvider';
import { Button, View, Text } from 'react-native';
import { gameDoneProps } from '../../types/';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function GameDone({route, navigation}: gameDoneProps) {
    const { game, setGame } = useContext(GameContext);

    return (
        <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Game Done</Text>
        <Text>{route.params.reason}</Text>
        <Button title='Back to Home' onPress={() => navigation.popToTop()} />
        </SafeAreaView>
    )
}