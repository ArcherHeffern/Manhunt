import * as Location from 'expo-location';
import { Magnetometer, MagnetometerMeasurement } from 'expo-sensors';
import React from 'react';

export default function useSensors() {

    const [errorMsg, setErrorMsg] = React.useState('');
    const [location, setLocation] = React.useState<Location.LocationObject|null>(null);
    const [magnetometerData, setMagnetometerData] = React.useState<MagnetometerMeasurement>({ x: 0, y: 0, z: 0 });

    React.useEffect(() => {

        Magnetometer.setUpdateInterval(1000);
        let unsubscribe = null;
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let { status: status2 } = await Magnetometer.requestPermissionsAsync();
            if (status2 !== 'granted') {
                setErrorMsg('Permission to access magnetometer was denied');
                return;
            }

            Magnetometer.addListener(magnetometerData => {
                const { x, y, z } = magnetometerData;
                setMagnetometerData({ x: Number.parseFloat(x.toFixed(2)), y: Number.parseFloat(y.toFixed(2)), z: Number.parseFloat(z.toFixed(2)) });
            });

            setLocation(await Location.getCurrentPositionAsync({}));
            unsubscribe = setInterval(async () => {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }, 1000);

        })();
        return () => {
            clearInterval(unsubscribe);
        }
    }, []);
    // TODO: Reminder that when we return location is null for some reason
    return {
        location,
        magnetometerData,
        errorMsg
    };
}