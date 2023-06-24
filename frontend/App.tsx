import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { Game as _Game } from './types';
import { GameContextValue } from './types/';
import Routing from './Routing';

export const connectionContext = createContext<Socket|null>(null); 
export const gameContext = createContext<GameContextValue|null>(null);

export default function App() {

  const [game, setGame] = React.useState<_Game>(null);

  return (
    <gameContext.Provider value={[game, setGame]}>
      <connectionContext.Provider value={io('http://localhost:8000')}>
        <Routing />
      </connectionContext.Provider>
    </gameContext.Provider>
  );
}
