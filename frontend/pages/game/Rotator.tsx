import React, { useEffect, useState } from "react";
import * as ExpoLocation from 'expo-location';
import { Dimensions, Image } from "react-native";
import { ServerLocationMessage } from "../../types";
const { height, width } = Dimensions.get("window");
import { LocationObject } from "expo-location";

type Props = {
    nearestPlayer: ServerLocationMessage;
    location: LocationObject;
}

export default function Rotator({ nearestPlayer, location }: Props) {
    const [nearestPlayerDirection, setNearestPlayerDirection] = useState(0);

    async function startCompass() {
        try {
            const response = await ExpoLocation.requestForegroundPermissionsAsync();
            if (!response.granted) {
                throw new Error('Location permission not granted');
            }
        } catch (err) {
            console.log('Error getting location permission: ', err);
            return () => { };
        }
        let isUnmounted = false;

        async function updateCompass() {
            if (isUnmounted) {
                return;
            }
            try {
                const location = await ExpoLocation.getHeadingAsync()
                // Do the math to update the nearest player direction
                setNearestPlayerDirection(location.trueHeading);
            } catch (err) {
                console.log('Error getting location: ', err);
            };
            setTimeout(updateCompass, 5);
        }
        updateCompass();
        return () => {
            isUnmounted = true;
        }
    }

    useEffect(() => {
        let unsubscribe: () => void;

        async function startAsync() {
        unsubscribe = await startCompass();
        }

        startAsync();

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <Image
            source={require("../../assets/compass_bg.png")}
            style={{
                width: Math.min(width, height) - 80,
                height: Math.min(width, height) - 80,
                justifyContent: "center",
                alignItems: "center",
                resizeMode: "contain",
                transform: [
                    { rotate: 360 - nearestPlayerDirection + "deg" },
                ],
            }}
        />
    )
}