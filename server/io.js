import * as config from '../config';
import SocketIO from 'socket.io';

// Generate a new socket.io server instance
let io = new SocketIO(undefined, config.ioServer);

// Add connection logging
io.on('connection', function(data) {
	console.log('join event fired', data);
});

// Installer method
export function install(app, server) {
	io.attach(server, config.ioServer);
}