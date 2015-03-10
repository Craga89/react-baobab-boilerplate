import React from 'react';
import AppWrapper from './AppWrapper.jsx';
import store from './store';
import actions from './actions/index';
import io from 'socket.io';
import {host, port} from '../config';

let App = React.render(<AppWrapper store={store} actions={actions}/>, document.body);

var socket = io.connect(`http://${host}:${port}`);

if(__DEV__) {
	window.APP = App;
	window.STORE = store;
	window.ACTIONS = actions;
	window.SOCKET = socket;
}
