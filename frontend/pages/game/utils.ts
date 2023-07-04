import { LocationObject } from "expo-location";
import socket from '../../socket';
import { navProps } from '../../types/'
import { ServerEvent, ClientEvent, Game, GameStatus, Role, Player, LocationMessage, GameOverBroadcast, GameTimeBroadcast, PlayerFoundBroadcast } from "../../types";
import { createGameEndListener } from "../../common";

export { createGameEndListener };

export function endGameBroadcast() {
    socket.send(ClientEvent.END_GAME_MESSAGE);
}

export function createGameOverListener(setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: navProps['navigation'], stopLocationBroadcast: () => void) {
    socket.on(ServerEvent.GAME_OVER_BROADCAST, (broadcast: GameOverBroadcast) => {
        console.log('game over broadcast received');
        setGame((game) => {
            return {
                ...game,
                status: GameStatus.COMPLETED,
                winner: broadcast.winner
            }
        }
        )
        stopLocationBroadcast();
        navigation.popToTop();
        navigation.navigate('GameDone', { reason: broadcast.reason });
    })
    return () => {
        socket.off(ServerEvent.GAME_OVER_BROADCAST);
    }
}

export function createPlayerLocationListener(setNearestPlayer: React.Dispatch<React.SetStateAction<LocationMessage>>) {
    socket.on(ServerEvent.PLAYER_LOCATION_BROADCAST, (location: LocationMessage) => {
        console.log('player location broadcast received');
        setNearestPlayer(location);
    }
    )
    return () => {
        socket.off(ServerEvent.PLAYER_LOCATION_BROADCAST);
    }
}

export function createPlayerFoundListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
    socket.on(ServerEvent.PLAYER_FOUND_BROADCAST, (message: PlayerFoundBroadcast) => {
        console.log('player found broadcast received');
        setGame((game) => {
            return {
                ...game,
                found: [...game.found, message.player]
            }
        })
    })
    return () => {
        socket.off(ServerEvent.PLAYER_FOUND_BROADCAST);
    };
}

export function createGameTimeListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
    socket.on(ServerEvent.GAME_TIME_BROADCAST, (broadcast: GameTimeBroadcast) => {
        console.log('game time broadcast received');
        const type = broadcast.type === GameStatus.GRACE ? 'grace': 'time';
        setGame((game) => {
            return {
                ...game,
                [type]: broadcast.time
            }
        })
    })
    return () => {
        socket.off(ServerEvent.GAME_TIME_BROADCAST);
    };
}

export function createGraceOverListener(location: LocationObject, setGame: React.Dispatch<React.SetStateAction<Game>>) {
    let sendLocationInterval: NodeJS.Timeout;
    socket.on(ServerEvent.GRACE_OVER_BROADCAST, () => {
        console.log('grace over broadcast received');
        setGame((game) => {
            return {
                ...game,
                status: GameStatus.RUNNING
            }
        });
        sendLocationInterval = setInterval(() => {
            socket.send(ClientEvent.PLAYER_LOCATION_MESSAGE, { longitude: location.coords.longitude, latitude: location.coords.latitude } as LocationMessage);
        }, 1000);
    })
    return {
        unsubscribe: () => {
            socket.off(ServerEvent.GRACE_OVER_BROADCAST);
        },
        stopLocationBroadcast: () => { clearInterval(sendLocationInterval); }
    }
};

export function gotCaughtBroadcast() {
    socket.send(ClientEvent.PLAYER_FOUND_MESSAGE);
}