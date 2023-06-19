/* eslint-disable @typescript-eslint/no-empty-interface */
import WebSocket from 'ws';

// Types of websocket events
// request/response: To specific client, response is sent back to client
// broadcast: To all clients
// message: To specific client

export type Clients = {
  [key: number]: WebSocket;
};

export enum Method {
  CREATE_GAME_REQUEST = 'createGameRequest',
  CREATE_GAME_RESPONSE = 'createGameResponse',
  JOIN_GAME_REQUEST = 'joinGameRequest',
  JOIN_GAME_RESPONSE = 'joinGameResponse',
  START_GAME_REQUEST = 'startGameRequest',
  START_GAME_RESPONSE = 'startGameResponse',
  GAME_QUEUE_BROADCAST = 'gameQueueBroadcast',
  GRACE_PERIOD_BROADCAST = 'gracePeriodBroadcast',
  PLAYER_LOCATION_MESSAGE = 'playerLocationMessage',
  PLAYER_LOCATION_BROADCAST = 'playerLocationBroadcast',
  PLAYER_FOUND_MESSAGE = 'playerFoundMessage',
  PLAYER_FOUND_BROADCAST = 'playerFoundBroadcast',
  GAME_OVER_BROADCAST = 'gameOverBroadcast',
}

export enum StatusCode {
  OK = 'OK',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export type Player = {
  id: number;
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
  id: number;
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

export function isGame(game: object): game is Game {
  return (
    game instanceof Object &&
    typeof (game as Game).id === 'number' &&
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

// Primative types - out of game

export interface ClientMessage {
  method: string;
  userId: number;
  userName?: string;
}

export function isClientMessage(message: object): message is ClientMessage {
  return (typeof (message as ClientMessage).method === 'string'
  && typeof (message as ClientMessage).userId === 'number'); 
}

export interface ClientRequest extends ClientMessage {}

export function isClientRequest(message: object): message is ClientRequest {
  return isClientMessage(message);
}


export interface ServerResponse {
  method: Method;
  status: StatusCode;
  message?: string;
}

export interface ServerMessage {
  method: Method;
}

export interface ServerBroadcast {
  method: Method;
}

// Primative types - in game

export interface ClientGameMessage extends ClientMessage {
  gameId: number;
}

export function isClientGameMessage(message: object): message is ClientGameMessage {
  return (isClientMessage(message) && typeof (message as ClientGameMessage).gameId === 'number');
}

export interface ClientGameRequest extends ClientGameMessage {}

export function isClientGameRequest(message: object): message is ClientGameRequest {
  return isClientGameMessage(message);
}

export interface ServerGameResponse extends ServerResponse {}

export interface ServerGameBroadcast extends ServerBroadcast {}

export interface ServerGameMessage extends ServerMessage {}

// Create Game
export interface CreateGameRequest extends ClientRequest {
  method: Method.CREATE_GAME_REQUEST;
  gameSettings: GameSettings;
}

export function isCreateGameRequest(message: object): message is CreateGameRequest {
  return isClientRequest(message)
  && (message as CreateGameRequest).method === Method.CREATE_GAME_REQUEST
  && isGameSettings((message as CreateGameRequest).gameSettings);
}

export interface CreateGameResponse extends ServerResponse {
  method: Method.CREATE_GAME_RESPONSE;
  game?: Game;
}

// Queue

export interface JoinGameRequest extends ClientGameRequest {
  method: Method.JOIN_GAME_REQUEST; 
  username?: string;
}

export function isJoinGameRequest(message: object): message is JoinGameRequest {
  return isClientGameRequest(message)
  && (message as JoinGameRequest).method === Method.JOIN_GAME_REQUEST
  && (typeof (message as JoinGameRequest).username === 'string' || (message as JoinGameRequest).username === undefined);
}

export interface JoinGameResponse extends ServerGameResponse {
  method: Method.JOIN_GAME_RESPONSE;
  game?: Game;
}

export interface GameQueueBroadcast extends ServerBroadcast {
  method: Method.GAME_QUEUE_BROADCAST;
  users: Player[];
}

// Start Game

export interface StartGameRequest extends ClientGameRequest {
  method: Method.START_GAME_REQUEST;
}

export function isStartGameRequest(message: object): message is StartGameRequest {
  return isClientGameRequest(message)
  && (message as StartGameRequest).method === Method.START_GAME_REQUEST;
}

export interface StartGameResponse extends ServerGameResponse {
  method: Method.START_GAME_RESPONSE;
}

// Game Running 
// Grace
export interface GracePeriodBroadcast extends ServerGameBroadcast {
  method: Method.GRACE_PERIOD_BROADCAST;
  time: number; // seconds
}

export interface ClientSidePlayerLocationMessage extends ClientGameMessage {
  method: Method.PLAYER_LOCATION_MESSAGE;
  location: string;
}

export function isClientSidePlayerLocationMessage(message: object): message is ClientSidePlayerLocationMessage {
  return isClientGameMessage(message)
  && (message as ClientSidePlayerLocationMessage).method === Method.PLAYER_LOCATION_MESSAGE
  && typeof (message as ClientSidePlayerLocationMessage).location === 'string';
}

export interface ServerSizePlayerLocationMessage extends ServerGameMessage {
  method: Method.PLAYER_LOCATION_BROADCAST;
  distance?: number;
  direction?: string; 
}

export interface PlayerFoundMessage extends ClientGameMessage { 
  method: Method.PLAYER_FOUND_MESSAGE;
}

export function isPlayerFoundMessage(message: object): message is PlayerFoundMessage {
  return isClientGameMessage(message)
  && (message as PlayerFoundMessage).method === Method.PLAYER_FOUND_MESSAGE;
}

export interface PlayerFoundBroadcast extends ServerGameBroadcast {
  method: Method.PLAYER_FOUND_BROADCAST;
  playerName: string;
  numRemaining: number;
}

// Game Over
export interface GameOverBroadcast extends ServerGameBroadcast {
  method: Method.GAME_OVER_BROADCAST;
  winner: string;
}