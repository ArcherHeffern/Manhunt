import React, { createContext, useState } from 'react';
import { GameContextValue } from './types/';

const GameContext = createContext<GameContextValue | null>(null);

const GameProvider = ({ children }) => {
  const [game, setGame] = useState(null);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };