/* eslint-disable @typescript-eslint/no-empty-interface */
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket, Server } from 'socket.io';

export type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>