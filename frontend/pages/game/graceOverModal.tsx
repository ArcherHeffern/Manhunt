import { View, Text, Button } from "react-native";
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

type Props = {
    modalVisible: boolean;
    closeModal: () => void;
}

export default function GraceOverModal({ modalVisible, closeModal }: Props) {
    if (!modalVisible) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalInnerContainer}>
                    <Text>Grace Period Over!</Text>
                    <Button title="Close" onPress={() => {
                        closeModal();
                    }} />
                </View>
            </SafeAreaView>
        )
    }
}