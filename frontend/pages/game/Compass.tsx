import Rotator from "./Rotator";
import { View, Text } from "react-native";
import { ServerLocationMessage } from "../../types";
import { LocationObject } from "expo-location";

type Props = {
    nearestPlayer: ServerLocationMessage | null;
    location: LocationObject;
}

export default function Compass({ nearestPlayer, location }: Props) {

    return (
        <View style={{ width: '100%' }}>
            <Text style={{ textAlign: 'center' }}>Tracking {nearestPlayer?.player?.name || 'null'}</Text>
            <View style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderRadius: 10000000, aspectRatio: 1, flexGrow: 1, margin: 10 }}>
                <Rotator nearestPlayer={nearestPlayer} location={location} />
            </View>
        </View>
    )
};