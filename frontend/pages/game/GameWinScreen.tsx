import { View, Text, Button } from "react-native";
import { useContext } from 'react';
import { GameContext } from '../../GameProvider';
import { navProps } from "../../types/";

type Props = {
    navigation: navProps['navigation']
}

export default function GameWinScreen({navigation}: Props) {

    const { game, setGame } = useContext(GameContext);

    return (
        <View>
        <Text>GameWinScreen</Text>
        <Text>The {game.winner}'s won!</Text>
        <Button title="Home Screen" onPress={() => {
            setGame(null);
            navigation.popToTop();
        }}/>
        </View>
    )
}