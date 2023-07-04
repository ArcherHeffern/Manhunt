import React, { useContext } from 'react';
import { GameContext } from '../../GameProvider';
import { Button, View, Text } from 'react-native';
import { gameDoneProps } from '../../types/';
import { GameStatus } from '../../types';

function GameDone({route, navigation}: gameDoneProps) {
    const { game, setGame } = useContext(GameContext);

    return (
        <div>
        <Text>Game Done</Text>
        <Text>{route.params.reason}</Text>
        <Button title='Back to Home' onPress={() => navigation.popToTop()} />
        </div>
    )
}