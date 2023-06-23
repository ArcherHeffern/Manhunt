
export type Clients = {
  [key: string]: WebSocket;
};

export enum Event {
  GENERAL = 'general',
  GAME = 'game',
  HUNTER = 'hunter',
  RUNNER = 'runner',
}

export enum ClientMethod {
  CREATE_GAME_REQUEST = 'createGameRequest',
  JOIN_GAME_REQUEST = 'joinGameRequest',
  LEAVE_GAME_MESSAGE = 'leaveGameMessage',
  START_GAME_MESSAGE = 'startGameMessage',
  PLAYER_LOCATION_MESSAGE = 'playerLocationMessage',
  PLAYER_FOUND_MESSAGE = 'playerFoundMessage',
  END_GAME_MESSAGE = 'endGameMessage',
}

export enum ServerMethod {
  CONNECT_RESPONSE = 'connectResponse',
  CREATE_GAME_RESPONSE = 'createGameResponse',
  JOIN_GAME_RESPONSE = 'joinGameResponse',
  GAME_QUEUE_BROADCAST = 'gameQueueBroadcast',
  GRACE_PERIOD_BROADCAST = 'gracePeriodBroadcast',
  STARTING_GAME_BROADCAST = 'startingGameBroadcast',
  PLAYER_LOCATION_BROADCAST = 'playerLocationBroadcast',
  PLAYER_FOUND_BROADCAST = 'playerFoundBroadcast',
  GAME_OVER_BROADCAST = 'gameOverBroadcast',
}

export interface ClientMessage {
  method: ClientMethod;
}

export interface ClientRequest extends ClientMessage {}

export interface ServerMessage {
  method: ServerMethod;
  message?: string;
}

export interface ServerResponse extends ServerMessage {
  status: StatusCode;
}

export interface ServerBroadcast extends ServerMessage {}

// Create Game
export interface CreateGameRequest extends ClientRequest {
  username?: string;
  gameSettings: GameSettings;
}

export function validateServerMessage(data: any, method: ServerMethod): boolean {
  if (typeof data !== 'object') {
    return false;
   }
  const data2 = data as ServerMessage;
  return method !== data2?.method
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

export type Game = {
  id: string;
  players: Player[];
  hunters: Player[];
  found: Player[];
  time: number; // seconds
  started: boolean;
  finished: boolean;
  winner: string|null;
  creator: string;
  created: Date;
  settings: GameSettings;
}

export type Games = { [key: string]: Game|undefined };

export function isGame(game: object): game is Game {
  return (
    game instanceof Object &&
    typeof (game as Game).id === 'string' &&
    typeof (game as Game).players === 'object' &&
    typeof (game as Game).hunters === 'object' &&
    typeof (game as Game).found === 'object' &&
    typeof (game as Game).time === 'number' &&
    typeof (game as Game).started === 'boolean' &&
    typeof (game as Game).finished === 'boolean' &&
    (typeof (game as Game).winner === 'string' || (game as Game).winner === null) &&
    typeof (game as Game).creator === 'string' &&
    typeof (game as Game).created === 'object' &&
    isGameSettings((game as Game).settings)
  );
}

type GameSettings = {
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


export function isCreateGameRequest(message: object): message is CreateGameRequest {
  return isGameSettings((message as CreateGameRequest).gameSettings);
}

export interface CreateGameResponse extends ServerResponse {
  game?: Game;
}

// Queue

export interface JoinGameRequest extends ClientRequest {
  gameId: string;
  username?: string;
}

export function isJoinGameRequest(message: object): message is JoinGameRequest {
  return typeof (message as JoinGameRequest).gameId === 'string'
  && (typeof (message as JoinGameRequest).username === 'string' || (message as JoinGameRequest).username === undefined);
}
export interface JoinGameResponse extends ServerResponse {
  game?: Game;
}
export interface LeaveGameMessage extends ClientMessage {}
export interface GameQueueBroadcast extends ServerBroadcast {
  method: ServerMethod.GAME_QUEUE_BROADCAST;
  players: Player[];
}

// Start Game

export interface StartGameMessage extends ClientMessage {}
export interface StartingGameBroadcast extends ServerBroadcast {}

// Game Running 
// Grace
export interface GracePeriodBroadcast extends ServerBroadcast {
  time: number; // seconds
}
export interface ClientSidePlayerLocationMessage extends ClientMessage {
  location: string;
}

export function isClientSidePlayerLocationMessage(message: object): message is ClientSidePlayerLocationMessage {
  return typeof (message as ClientSidePlayerLocationMessage).location === 'string';
}
export interface ServerSidePlayerLocationMessage extends ServerMessage {
  distance?: number;
  direction?: string; 
}

export interface PlayerFoundMessage extends ClientMessage {}
export interface PlayerFoundBroadcast extends ServerBroadcast {
  playerName: string;
  numRemaining: number;
}

// Game Over
export interface GameOverBroadcast extends ServerBroadcast {
  winner: string;
}