import io from 'socket.io';
import store from './store';

// Connect to the server
var socket = io(window.location.origin);

// Listen for store updates and apply them
socket.on('store:update', ({ key, value }) => {
	var cursor = store.select(key);

	if(value.push) {
		cursor.edit(value);
	}
	else if(typeof value === 'object') {
		cursor.merge(value);
	}
	else {
		cursor.edit(value);
	}
});

// Expose in DEBUG mode
if(__DEBUG__) {
	window.SOCKET = socket;
}

export default socket;