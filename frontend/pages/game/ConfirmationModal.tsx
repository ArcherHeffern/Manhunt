import { View, Text, Button } from "react-native";
import React from 'react';
import { gotCaughtBroadcast } from './utils';
import { navProps } from '../../types/'

type Props = {
    modalVisible: boolean;
    closeModal: () => void;
    navigation: navProps['navigation'];
}

export default function ConfirmationModal({modalVisible, closeModal, navigation}: Props) {

    if (!modalVisible) {
        return null;
    } else {
        return (
            <View>
                <Text>Modal</Text>
                <Button title="Close" onPress={() => {
                    closeModal();
                }} />
                <Button title="Confirm" onPress={() => {
                    gotCaughtBroadcast();
                    closeModal();
                    navigation.navigate('GameDone', {reason: "You got caught!"});
                }} />
            </View>
        )
    }
}