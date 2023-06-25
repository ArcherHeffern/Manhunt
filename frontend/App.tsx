import React, { createContext } from 'react';
import { Game as _Game } from './types';
import { GameContextValue } from './types/';
import Routing from './Routing';

export const gameContext = createContext<GameContextValue|null>(null);

export default function App() {

  const [game, setGame] = React.useState<_Game>(null);

  return (
    <gameContext.Provider value={[game, setGame]}>
        <Routing />
    </gameContext.Provider>
  );
}
