import * as config from '../config';

import winston from 'winston';
import SocketIO from 'socket.io';

// Generate a new socket.io server instance
let io = new SocketIO(undefined, config.ioServer);

// Add connection logging
io.on('connection', function(data) {
	winston.info('[socket.io]', 'New client joined!');
});

// Listener method
export function listen(app, server) {
	io.attach(server, config.ioServer);
}