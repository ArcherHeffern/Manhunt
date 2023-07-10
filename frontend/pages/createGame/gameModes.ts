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

export const soloEvasionSettings: GameModeSettings = {
  maxPlayers: [5, true],
  numHunters: [10000000, false],
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