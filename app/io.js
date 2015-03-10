import io from 'socket.io';

// Connect to the server
var socket = io.connect(window.location.origin);

// Expose in DEBUG mode
if(__DEBUG__) {
	window.SOCKET = socket;
}

export default socket;