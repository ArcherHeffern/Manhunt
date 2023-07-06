import Rotator from "./Rotator";
import { View, Text, Dimensions, Image } from "react-native";
const { height, width } = Dimensions.get("window");
import { ServerLocationMessage } from "../../types";
import { LocationObject } from "expo-location";

type Props = {
  nearestPlayer: ServerLocationMessage | null;
  location: LocationObject;
}

export default function Compass({nearestPlayer, location}: Props) {

    return (
        <View style={{ width: '100%' }}>
            <Text style={{textAlign: 'center'}}>Tracking {nearestPlayer?.player?.name||'null'}</Text>
            <View style={{ backgroundColor: '#000' }}>
                <View style={{ alignItems: "center" }}>
                    <View style={{ width, alignItems: "center", bottom: 0 }}>
                        <Image
                            source={require("../../assets/compass_pointer.png")}
                            style={{
                                height: height / 26,
                                width: '100%',
                                resizeMode: "contain",
                            }}
                        />
                    </View>
                </View>

                <View style={{ alignItems: "center" }}>
                    <Rotator nearestPlayer={nearestPlayer} location={location}/>
                </View>
            </View>
        </View>
    )
};