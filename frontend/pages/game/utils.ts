import { createGameEndListener } from "../../common";
import socket from '../../socket';
import { ServerEvent, ClientEvent, Game, GameStatus, Role, Player } from "../../types";

export { createGameEndListener };

export function createGameOverListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
    socket.on(ServerEvent.GAME_OVER_BROADCAST, (winner: Role) => {
        console.log('game over broadcast received');
        setGame((game) => {
            return {
                ...game,
                status: GameStatus.OVER,
                winner
            }
        }
        )
    })
    return () => {
        socket.off(ServerEvent.GAME_OVER_BROADCAST);
    }
}

export function createPlayerLocationListener() {
    socket.on(ServerEvent.PLAYER_LOCATION_BROADCAST, (location: string) => {
        console.log('player location broadcast received');
    }
    )
    return () => {
        socket.off(ServerEvent.PLAYER_LOCATION_BROADCAST);
    }
}

export function createPlayerFoundListener(setGame: React.Dispatch<React.SetStateAction<Game>>) {
    socket.on(ServerEvent.PLAYER_FOUND_BROADCAST, (player: Player) => {
        console.log('player found broadcast received');
        setGame((game) => {
            return {
                ...game,
                found: [...game.found, player]
            }
        })
    })
    return () => {
        socket.off(ServerEvent.PLAYER_FOUND_BROADCAST);
    };
}

export function createGraceOverListener() {
    socket.on(ServerEvent.GRACE_OVER_BROADCAST, () => {
        console.log('grace over broadcast received');
    })
    return () => {
        socket.off(ServerEvent.GRACE_OVER_BROADCAST);
    }
}