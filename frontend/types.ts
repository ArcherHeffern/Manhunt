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
  CONNECT_RESPONSE = 'connectResponse',
  CREATE_GAME_RESPONSE = 'createGameResponse',
  JOIN_GAME_RESPONSE = 'joinGameResponse',
  GAME_QUEUE_BROADCAST = 'gameQueueBroadcast',
  START_GAME_RESPONSE = 'startGameResponse',
  GAME_START_BROADCAST = 'gameStartBroadcast',
  GRACE_OVER_BROADCAST = 'graceOverBroadcast',
  PLAYER_LOCATION_BROADCAST = 'playerLocationBroadcast',
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

export type Player = {
  id: string;
  name: string;
  location?: string;
}

export function isPlayer(player: object): player is Player {
  return (
    player instanceof Object &&
    typeof (player as Player).id === 'string' &&
    typeof (player as Player).name === 'string' &&
    (typeof (player as Player).location === 'string' || (player as Player).location === undefined)
  );
}

export enum GameStatus {
  WAITING = 'waiting',
  GRACE = 'grace',
  RUNNING = 'running',
  OVER = 'over',
}

export type Game = {
  id: string;
  players: Player[];
  hunters: Player[];
  runners: Player[];
  found: Player[];
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
  maxRounds: number;
  maxTime: number;
  gracePeriod: number;
  showDistance: boolean;
  hotCold: boolean;
};

function isGameSettings(settings: object): settings is GameSettings {
  return (
    settings instanceof Object &&
    typeof (settings as GameSettings).maxPlayers === 'number' &&
    typeof (settings as GameSettings).numHunters === 'number' &&
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
export interface GracePeriodBroadcast extends Broadcast {
  time: number; // seconds
}
export interface ClientSidePlayerLocationMessage extends Message {
  location: string;
}

export function isClientSidePlayerLocationMessage(message: object): message is ClientSidePlayerLocationMessage {
  return typeof (message as ClientSidePlayerLocationMessage).location === 'string';
}
export interface ServerSidePlayerLocationMessage extends Message {
  distance?: number;
  direction?: string; 
}

export interface PlayerFoundMessage extends Message {}
export interface PlayerFoundBroadcast extends Broadcast {
  playerName: string;
  numRemaining: number;
}

// Game Over
export interface GameOverBroadcast extends Broadcast {
  winner: string;
}