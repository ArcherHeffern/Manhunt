import { View, Text, Button } from "react-native";
import React from 'react';
import { gotCaughtBroadcast } from './utils';
import { navProps } from '../../types/'
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

type Props = {
    modalVisible: boolean;
    closeModal: () => void;
    navigation: navProps['navigation'];
}

export default function ConfirmationModal({ modalVisible, closeModal, navigation }: Props) {

    if (!modalVisible) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalInnerContainer}>
                    <Text>Have you been found?</Text>
                    <Button title="Confirm" onPress={() => {
                        gotCaughtBroadcast();
                        closeModal();
                        navigation.navigate('GameDone', { reason: "You got caught!" });
                    }} />
                    <Button title="Close" onPress={() => {
                        closeModal();
                    }} />
                </View>
            </SafeAreaView>
        )
    }
}