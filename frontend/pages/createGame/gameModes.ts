import { GameModeSettings, GameSettings } from "../../types"
export const defaultSettings: GameSettings = {
  maxPlayers: 5,
  numHunters: 1,
  maxRounds: 1,
  maxTime: 120,
  hunterInterval: 10,
  runnerInterval: 20,
  gracePeriod: 60,
  showDistance: false,
  hotCold: false,
};

export const loneHunterSettings: GameModeSettings = {
  name: 'Lone Hunter',
  description: 'One hunter, multiple runners. The hunter has to find and eliminate all the runners. The runners have to survive for the duration of the game.',
  maxPlayers: [5, true],
  numHunters: [1, false],
  maxRounds: [1, false],
  maxTime: [120, true],
  hunterInterval: [10, true],
  runnerInterval: [20, true],
  gracePeriod: [60, true],
  showDistance: [false, false],
  hotCold: [false, false], 
};

export const duel: GameModeSettings = {
  name: 'Duel',
  description: 'One hunter, one runner. The runner has to survive for the duration of the game. The hunter has to find the runner and eliminate them.',
  maxPlayers: [2, false],
  numHunters: [1, false],
  maxRounds: [1, false],
  maxTime: [120, true],
  hunterInterval: [10, true],
  runnerInterval: [20, true],
  gracePeriod: [60, true],
  showDistance: [false, false],
  hotCold: [false, false],
}

export const soloEvasionSettings: GameModeSettings = {
  name: 'Solo Evasion',
  description: 'One runner, multiple hunters. The runner has to survive for the duration of the game. The hunters have to find and eliminate the runner.',
  maxPlayers: [5, true],
  numHunters: [-1, false],
  maxRounds: [1, false],
  maxTime: [120, true],
  hunterInterval: [10, true],
  runnerInterval: [20, true],
  gracePeriod: [60, true],
  showDistance: [false, false],
  hotCold: [false, false],
};

export const customSettings: GameModeSettings = {
  name: 'Custom',
  description: 'Custom settings. You can set the number of players, hunters, rounds, time, and intervals.',
  maxPlayers: [5, true],
  numHunters: [1, true],
  maxRounds: [1, false],
  maxTime: [120, true],
  hunterInterval: [10, true],
  runnerInterval: [20, true],
  gracePeriod: [60, true],
  showDistance: [false, false],
  hotCold: [false, false],
};

export const toGameSettings = (settings: GameModeSettings): GameSettings => {
  return {
    maxPlayers: settings.maxPlayers[0],
    numHunters: settings.numHunters[0],
    maxRounds: settings.maxRounds[0],
    maxTime: settings.maxTime[0],
    hunterInterval: settings.hunterInterval[0],
    runnerInterval: settings.runnerInterval[0],
    gracePeriod: settings.gracePeriod[0],
    showDistance: settings.showDistance[0],
    hotCold: settings.hotCold[0],
  };
}

export type AllSettings = {
  [key: string]: GameModeSettings
}
export const allSettings: AllSettings = {
  soloEvasionSettings,
  loneHunterSettings,
  duel,
  customSettings,
}