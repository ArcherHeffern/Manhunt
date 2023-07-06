import socket from '../../socket';
import { navProps } from '../../types/'
import { ServerEvent, ClientEvent, Game, GameStatus, Role, Player, ServerLocationMessage, GameOverBroadcast, GameTimeBroadcast, PlayerFoundBroadcast, timeUntilNextLocationBroadcast } from "../../types";
import { createGameEndListener, leaveGame } from "../../common";

export { createGameEndListener, leaveGame };

export function endGameBroadcast(navigation: navProps['navigation']) {
    socket.emit(ClientEvent.END_GAME_MESSAGE);
    navigation.popToTop();
}

export function createGameOverListener(setGame: React.Dispatch<React.SetStateAction<Game>>, navigation: navProps['navigation']) {
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
        navigation.popToTop();
        navigation.navigate('GameDone', { reason: broadcast.reason });
    })
    return () => {
        socket.off(ServerEvent.GAME_OVER_BROADCAST);
    }
}

export function createPlayerLocationListener(setNearestPlayer: React.Dispatch<React.SetStateAction<ServerLocationMessage>>) {
    socket.on(ServerEvent.PLAYER_LOCATION_BROADCAST, (location: ServerLocationMessage) => {
        setNearestPlayer(location);
    }
    )
    return () => {
        socket.off(ServerEvent.PLAYER_LOCATION_BROADCAST);
    }
}

export function createPlayerFoundListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
    socket.on(ServerEvent.PLAYER_FOUND_BROADCAST, (message: PlayerFoundBroadcast) => {
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

export function createGraceOverListener(setGame: React.Dispatch<React.SetStateAction<Game>>, game: Game, openGraceOverModal: () => void) {
    socket.on(ServerEvent.GRACE_OVER_BROADCAST, () => {
        setGame((game) => {
            return {
                ...game,
                status: GameStatus.RUNNING
            }
        });
        openGraceOverModal();
    })
    return () => {
            socket.off(ServerEvent.GRACE_OVER_BROADCAST);
        }
};

export function gotCaughtBroadcast() {
    socket.emit(ClientEvent.PLAYER_FOUND_MESSAGE);
}

export function createTimeUntilLocationUpdateListener(setTimeUntilLocationUpdate: React.Dispatch<React.SetStateAction<number>>) {
    socket.on(ServerEvent.TIME_UNTIL_NEXT_LOCATION_BROADCAST, (broadcast: timeUntilNextLocationBroadcast) => {
        setTimeUntilLocationUpdate(broadcast.time);
    })
    return () => {
        socket.off(ServerEvent.TIME_UNTIL_NEXT_LOCATION_BROADCAST);
    };
}