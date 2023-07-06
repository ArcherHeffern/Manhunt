import React, { useEffect, useState } from "react";
import * as ExpoLocation from 'expo-location';
import { Dimensions, Image } from "react-native";
import { ServerLocationMessage } from "../../types";
const { height, width } = Dimensions.get("window");
import { LocationObject } from "expo-location";
import convertToHeading from "./converted";

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
                const trueHeading = (await ExpoLocation.getHeadingAsync()).trueHeading;
                const a = {
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude
                }
                const b = {
                    latitude: nearestPlayer?.player?.location?.lat || 0,
                    longitude: nearestPlayer?.player?.location?.lng || 0
                }
                console.log(!!(a.latitude && a.longitude && b.latitude && b.longitude));
                const heading = convertToHeading(a, b, trueHeading)
                setNearestPlayerDirection(heading);
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
            source={require("../../assets/white-arrow.png")}
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