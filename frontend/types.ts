export enum ClientEvent {
  CREATE_GAME_REQUEST = 'createGameRequest',
  JOIN_GAME_REQUEST = 'joinGameRequest',
  LEAVE_GAME_MESSAGE = 'leaveGameMessage',
  START_GAME_REQUEST = 'startGameMessage',
  PLAYER_LOCATION_MESSAGE = 'playerLocationMessage',
  PLAYER_FOUND_MESSAGE = 'playerFoundMessage',
  END_GAME_MESSAGE = 'endGameMessage',
}

export enum ServerEvent {
  GAME_TIME_BROADCAST = 'gameTimeBroadcast',
  CONNECT_RESPONSE = 'connectResponse',
  CREATE_GAME_RESPONSE = 'createGameResponse',
  JOIN_GAME_RESPONSE = 'joinGameResponse',
  GAME_QUEUE_BROADCAST = 'gameQueueBroadcast',
  START_GAME_RESPONSE = 'startGameResponse',
  GAME_START_BROADCAST = 'gameStartBroadcast',
  GRACE_OVER_BROADCAST = 'graceOverBroadcast',
  PLAYER_LOCATION_BROADCAST = 'playerLocationBroadcast',
  TIME_UNTIL_NEXT_LOCATION_BROADCAST = 'timeUntilNextLocationBroadcast',
  PLAYER_FOUND_BROADCAST = 'playerFoundBroadcast',
  GAME_END_BROADCAST = 'gameEndBroadcast', // for when the game ends prematurely - either in queue or in game
  GAME_OVER_BROADCAST = 'gameOverBroadcast', // for when the game ends normally
}

export enum DebugEvent {
  GET_GAMES = 'getGames',
  SEND_TO_ROOM = 'sendToRoom',
}

export interface Message {
  message?: string;
}

export interface Broadcast extends Message {}

export interface Request {}

export interface Response extends Message {
  status: StatusCode;
}

export enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

export type Location = {
  lat: number;
  lng: number;
}

export type Player = {
  id: string;
  name: string;
  location?: Location;
}

export function isPlayer(player: object): player is Player {
  return (
    player instanceof Object &&
    typeof (player as Player).id === 'string' &&
    typeof (player as Player).name === 'string' &&
    (typeof (player as Player).location === 'string' || (player as Player).location === undefined)
  );
}

// What I would like: Enum of all possible game statuses, and the done status can be one of multiple types of endings, think of it as a nested enum
export enum GameStatus {
  WAITING = 'waiting',
  GRACE = 'grace',
  RUNNING = 'running',
  COMPLETED = 'completed',
  ENDED = 'ended',
}

export type Game = {
  id: string;
  players: Player[];
  hunters: Player[];
  runners: Player[];
  found: Player[];
  grace: number; // seconds
  time: number; // seconds
  status: GameStatus
  winner?: Role;
  created: Date;
  settings: GameSettings;
}

export enum Role {
  HUNTER = 'hunter',
  RUNNER = 'runner',
}

export function isGame(game: object): game is Game {
  return (
    game instanceof Object &&
    typeof (game as Game).id === 'string' &&
    typeof (game as Game).players === 'object' &&
    typeof (game as Game).hunters === 'object' &&
    typeof (game as Game).runners === 'object' &&
    typeof (game as Game).found === 'object' &&
    typeof (game as Game).grace === 'number' &&
    typeof (game as Game).time === 'number' &&
    typeof (game as Game).status === 'string' &&
    (typeof (game as Game).winner === 'string' || (game as Game).winner === null) &&
    typeof (game as Game).created === 'object' &&
    isGameSettings((game as Game).settings)
  );
}

export type Games = { [key: string]: Game|undefined };

export type GameSettings = {
  maxPlayers: number;
  numHunters: number;
  runnerInterval: number; // In seconds
  hunterInterval: number; // In seconds
  maxRounds: number;
  maxTime: number;
  gracePeriod: number;
  showDistance: boolean;
  hotCold: boolean;
};

export type GameModeSettings = {
  maxPlayers: [number, boolean];
  numHunters: [number, boolean];
  runnerInterval: [number, boolean];
  hunterInterval: [number, boolean];
  maxRounds: [number, boolean];
  maxTime: [number, boolean];
  gracePeriod: [number, boolean];
  showDistance: [boolean, boolean];
  hotCold: [boolean, boolean];
}

function isGameSettings(settings: object): settings is GameSettings {
  return (
    settings instanceof Object &&
    typeof (settings as GameSettings).maxPlayers === 'number' &&
    typeof (settings as GameSettings).numHunters === 'number' &&
    typeof (settings as GameSettings).runnerInterval === 'number' &&
    typeof (settings as GameSettings).hunterInterval === 'number' &&
    typeof (settings as GameSettings).maxRounds === 'number' &&
    typeof (settings as GameSettings).maxTime === 'number' &&
    typeof (settings as GameSettings).gracePeriod === 'number' &&
    typeof (settings as GameSettings).showDistance === 'boolean' &&
    typeof (settings as GameSettings).hotCold === 'boolean'
  );
}

// Create game
export interface CreateGameRequest extends Request {
  username?: string;
  gameSettings: GameSettings;
}

export function isCreateGameRequest(message: object): message is CreateGameRequest {
  return isGameSettings((message as CreateGameRequest).gameSettings);
}

export interface CreateGameResponse extends Response {
  game?: Game;
}

// Queue

export interface JoinGameRequest extends Request {
  gameId: string;
  username?: string;
}

export function isJoinGameRequest(message: object): message is JoinGameRequest {
  return typeof (message as JoinGameRequest).gameId === 'string'
  && (typeof (message as JoinGameRequest).username === 'string' || (message as JoinGameRequest).username === undefined);
}
export interface JoinGameResponse extends Response {
  game?: Game;
}
export interface LeaveGameMessage extends Message {}
export interface GameQueueBroadcast extends Broadcast {
  players: Player[];
}

// Start Game

export interface StartGameRequest extends Request {}
export interface StartGameResponse extends Response {}
export interface GameStartBroadcast extends Broadcast {
  role?: Role;
  runners: Player[];
  hunters: Player[];
}

// Game Running 
// Grace
export interface GracePeriodEndBroadcast extends Broadcast {
  time: number; // seconds
}
export interface ServerLocationMessage extends Message {
  player: Player;
}

export interface ClientLocationMessage extends Message {
  player: Player;
  gameId: string;
}

export interface PlayerFoundMessage extends Message {}
export interface PlayerFoundBroadcast extends Broadcast {
  player: Player;
}

// Game Over
export interface GameOverBroadcast extends Broadcast {
  winner: Role;
  reason: string;
}

export interface GameTimeBroadcast extends Broadcast {
  time: number; // seconds
  type: GameStatus;
}

export interface timeUntilNextLocationBroadcast extends Broadcast {
  time: number; // seconds
}