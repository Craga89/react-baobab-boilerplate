import * as config from '../config';

import store from '../store';
import winston from 'winston';
import SocketIO from 'socket.io';

// Generate a new socket.io server instance
let io = new SocketIO(undefined, config.ioServer);

// Add connection logging
io.on('connection', function(socket) {
	winston.info('[socket.io]', 'Client connected');

	socket.on('disconnect', function() {
		winston.info('[socket.io]', 'Client disconnected');
	});
});

// When the store changes, reflect the updates on the client
store.on('update', function(event) {
	let changedKeys = event.data.log;

	for (let key of changedKeys) {
		// Handle non-array keypaths by splitting
		if(typeof key === 'string') {
			key = key.split(',');
		}

		// Get the new value
		let value = store.get(key);

		// Emit a store:update event to all connected clients
		io.emit('store:update', { key, value });
	}
});

// Listener method
export function listen(app, server) {
	io.attach(server, config.ioServer);
}