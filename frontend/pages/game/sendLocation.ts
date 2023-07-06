
// updates location when location updates

import { useEffect } from "react";
import { ClientEvent, ClientLocationMessage, Game, Location, Player } from "../../types";
import socket from "../../socket";
import useSensors from "./sensorsHook";

// sends location when location updates
export default function sendLocation(game: Game, setGame: React.Dispatch<React.SetStateAction<Game>>) {
  const { errorMsg, location } = useSensors();
  useEffect(() => {
    setGame((game) => {
      return {
        ...game,
        players: game.players.map((player) => {
          if (player.id === socket.id) {
            return {
              ...player,
              location: {
                lat: location?.coords?.latitude,
                lng: location?.coords?.longitude,
              } as Location
            } as Player;
          }
          return player;
        })
      }
    })
    const broadcast: ClientLocationMessage = {
      gameId: game.id,
      player: game.players.filter((player) => player.id === socket.id)[0],
    }
    socket.emit(ClientEvent.PLAYER_LOCATION_MESSAGE, broadcast);
  }, [location])
  return { location, errorMsg}
}