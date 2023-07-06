import * as Location from 'expo-location';
import React from 'react';

type Sensors = {
        location: Location.LocationObject | null;
        errorMsg: string;
}

export default function useSensors() {

    const [errorMsg, setErrorMsg] = React.useState('');
    const [location, setLocation] = React.useState<null|Location.LocationObject>(null);

    React.useEffect(() => {

        let unsubscribe = null;
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

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
    return {
        location,
        errorMsg
    } as Sensors}