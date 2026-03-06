import { EventEmitter } from 'events';

// This is a global event emitter for uncaught exceptions.
// In Next.js, this is a singleton on the server and a new instance on the client.
export const errorEmitter = new EventEmitter()